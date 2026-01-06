
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ICONS } from '../constants';
import { ScannedReceipt, ReceiptItem } from '../types';
import { Loader2, Upload, FileText, CheckCircle2, Camera, X, RefreshCw, Scan, AlertTriangle, Trash2, Calendar } from 'lucide-react';

interface ReceiptScannerProps {
  onReceiptProcessed: (receipt: ScannedReceipt) => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onReceiptProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [pendingReceipt, setPendingReceipt] = useState<ScannedReceipt | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setError(null);
    setPendingReceipt(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setPreview(null);
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreview(dataUrl);
        stopCamera();
        processImage(dataUrl);
      }
    }
  };

  const processImage = async (base64Data: string) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data.split(',')[1] } },
            { text: "Extract data from this Indonesian receipt. Return valid JSON only: { merchantName: string, date: string, items: [{name: string, quantity: number, unitPrice: number, total: number}], grandTotal: number, category: 'Fresh'|'Dry'|'Beverage'|'Other' }." }
          ]
        },
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      setPendingReceipt({
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      });
    } catch (error) {
      alert("Failed to process receipt. Try a clearer photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateItem = (index: number, field: keyof ReceiptItem, value: any) => {
    if (!pendingReceipt) return;
    const newItems = [...pendingReceipt.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total for that item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    const newGrandTotal = newItems.reduce((acc, item) => acc + item.total, 0);
    setPendingReceipt({ ...pendingReceipt, items: newItems, grandTotal: newGrandTotal });
  };

  const removeItem = (index: number) => {
    if (!pendingReceipt) return;
    const newItems = pendingReceipt.items.filter((_, i) => i !== index);
    const newGrandTotal = newItems.reduce((acc, item) => acc + item.total, 0);
    setPendingReceipt({ ...pendingReceipt, items: newItems, grandTotal: newGrandTotal });
  };

  const handleSave = () => {
    if (pendingReceipt) {
      onReceiptProcessed(pendingReceipt);
      setPendingReceipt(null);
      setPreview(null);
    }
  };

  if (pendingReceipt) {
    return (
      <div className="bg-white rounded-[40px] shadow-2xl p-6 md:p-8 border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-500 rounded-2xl text-white shadow-lg shadow-green-200">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#2D3E2D]">Confirm Receipt</h2>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Calendar size={12} />
              <span>{pendingReceipt.date || 'Today'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Merchant Name</label>
             <input 
               value={pendingReceipt.merchantName} 
               onChange={(e) => setPendingReceipt({...pendingReceipt, merchantName: e.target.value})}
               className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-[#2D3E2D]"
             />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-bold text-sm text-[#2D3E2D]">Edit Items</h3>
              <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md font-bold text-gray-500">{pendingReceipt.items.length} items</span>
            </div>
            {pendingReceipt.items.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm relative group">
                <button 
                  onClick={() => removeItem(idx)}
                  className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="mb-3 pr-8">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Item Name</label>
                  <input 
                    value={item.name} 
                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    className="w-full text-sm font-semibold text-[#2D3E2D] bg-transparent outline-none focus:ring-b-2 ring-[#D9ED92]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Qty</label>
                    <input 
                      type="number"
                      value={item.quantity} 
                      onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                      className="w-full text-sm font-medium text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Price (Rp)</label>
                    <input 
                      type="number"
                      value={item.unitPrice} 
                      onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value))}
                      className="w-full text-sm font-medium text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex justify-between items-center px-4 py-4 bg-[#2D3E2D] text-white rounded-3xl mb-4">
            <span className="font-bold text-sm">TOTAL AMOUNT</span>
            <span className="text-xl font-black text-[#D9ED92]">Rp{pendingReceipt.grandTotal.toLocaleString()}</span>
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-[#4ADE80] text-white py-4 rounded-3xl font-bold text-lg hover:brightness-105 active:scale-[0.98] transition-all shadow-xl shadow-green-100"
          >
            Save Receipt
          </button>
          <button 
            onClick={() => { setPendingReceipt(null); startCamera(); }}
            className="w-full bg-[#F8F9FA] text-[#2D3E2D] py-4 rounded-3xl font-bold border border-gray-100 hover:bg-gray-100 transition-all"
          >
            Rescan Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] shadow-xl p-8 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <span className="p-2 bg-[#D9ED92] rounded-xl">{ICONS.Camera}</span>
            Leafslip Scanner
          </h3>
          <p className="text-gray-500 mt-1">Transform paper to pixels</p>
        </div>
        <div className="flex gap-2">
           {!isCameraActive && !isProcessing && (
             <button 
                onClick={startCamera}
                className="flex items-center gap-2 bg-[#2D3E2D] text-[#D9ED92] px-5 py-2.5 rounded-2xl font-bold text-sm hover:brightness-125 transition-all shadow-md"
             >
               <Camera size={18} />
               Scan Receipt
             </button>
           )}
           {isCameraActive && (
             <button 
                onClick={stopCamera}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all shadow-sm"
             >
               <X size={18} />
               Close Camera
             </button>
           )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[32px] bg-gray-950 min-h-[400px] flex flex-col items-center justify-center transition-all group">
        <canvas ref={canvasRef} className="hidden" />

        {isProcessing ? (
          <div className="text-center animate-pulse p-12 bg-white w-full h-full absolute inset-0 z-30 flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-[#2D3E2D] animate-spin mb-6" />
            <p className="text-[#2D3E2D] font-bold text-2xl tracking-tighter">AI Processing...</p>
          </div>
        ) : isCameraActive ? (
          <div className="relative w-full h-[500px] bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-12">
              <div className="w-full max-w-[300px] aspect-[1/2] border-2 border-[#D9ED92]/50 rounded-2xl relative shadow-[0_0_0_100vw_rgba(0,0,0,0.4)]">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#D9ED92] rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#D9ED92] rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#D9ED92] rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#D9ED92] rounded-br-xl"></div>
              </div>
            </div>
            {isFlashing && <div className="absolute inset-0 bg-white z-50"></div>}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 bg-white rounded-full border-[6px] border-[#D9ED92] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                <div className="w-12 h-12 bg-[#2D3E2D] rounded-full flex items-center justify-center"><Scan className="text-[#D9ED92]" size={24} /></div>
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-[400px] flex flex-col items-center justify-center p-12 cursor-pointer bg-white group"
          >
            <input type="file" ref={fileInputRef} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => processImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} className="hidden" accept="image/*" />
            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-[#D9ED92]/20 transition-all border border-gray-100">
              <Upload className="text-gray-400 group-hover:text-[#2D3E2D]" size={36} />
            </div>
            <h4 className="text-[#2D3E2D] font-bold text-2xl tracking-tight mb-2">Scan Now</h4>
            <p className="text-sm text-gray-500 text-center">Take a photo or upload a receipt to digitize your inventory instantly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptScanner;
