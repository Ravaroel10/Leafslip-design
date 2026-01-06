
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
      <div className="bg-[#FBFFF0] min-h-[600px] rounded-[40px] shadow-2xl p-6 md:p-8 flex flex-col border border-green-100 max-w-md mx-auto animate-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-[#2E7D32] mb-6">Confirm Receipt</h2>
        
        <div className="flex items-center gap-2 text-green-600 font-medium mb-8 bg-green-50 w-fit px-4 py-1.5 rounded-full text-sm">
          <Calendar size={16} />
          <span>{pendingReceipt.date || '25 July 2025'}</span>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-[#2E7D32]">Edit Items</h3>
          </div>

          {pendingReceipt.items.map((item, idx) => (
            <div key={idx} className="space-y-3 pb-4 border-b border-green-50 relative group">
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative">
                  <span className="absolute -top-2 left-2 px-1 bg-[#FBFFF0] text-[9px] font-bold text-green-600 uppercase">Item</span>
                  <input 
                    value={item.name} 
                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm font-medium text-green-800 outline-none focus:border-green-400 bg-white"
                  />
                </div>
                <button 
                  onClick={() => removeItem(idx)}
                  className="p-2.5 bg-red-500 text-white rounded-lg hover:brightness-110 transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-[#FBFFF0] text-[9px] font-bold text-green-600 uppercase">Qty</span>
                  <input 
                    type="number"
                    value={item.quantity} 
                    onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm font-medium text-green-800 outline-none focus:border-green-400 bg-white"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-[#FBFFF0] text-[9px] font-bold text-green-600 uppercase">Price</span>
                  <input 
                    type="number"
                    value={item.unitPrice} 
                    onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm font-medium text-green-800 outline-none focus:border-green-400 bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <button 
            onClick={handleSave}
            className="w-full bg-[#39FF14] text-[#2D3E2D] py-5 rounded-2xl font-black text-lg hover:brightness-105 active:scale-[0.98] transition-all shadow-lg"
          >
            Save Receipt
          </button>
          <button 
            onClick={() => { setPendingReceipt(null); startCamera(); }}
            className="w-full bg-green-50 text-green-700 py-4 rounded-2xl font-bold border border-green-100 hover:bg-green-100 transition-all"
          >
            Rescan Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] shadow-xl p-8 border border-gray-100 w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <span className="p-2 bg-[#D9ED92] rounded-xl">{ICONS.Camera}</span>
            Scanner
          </h3>
          <p className="text-gray-500 mt-1">Place your receipt in the frame</p>
        </div>
        {!isCameraActive && !isProcessing && (
           <button 
              onClick={startCamera}
              className="flex items-center gap-2 bg-[#2D3E2D] text-[#D9ED92] px-6 py-3 rounded-2xl font-bold hover:brightness-125 transition-all shadow-md"
           >
             <Camera size={20} />
             Start Camera
           </button>
         )}
      </div>

      <div className="relative overflow-hidden rounded-[32px] bg-gray-950 min-h-[500px] flex flex-col items-center justify-center transition-all group">
        <canvas ref={canvasRef} className="hidden" />

        {isProcessing ? (
          <div className="text-center p-12 bg-white w-full h-full absolute inset-0 z-30 flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-[#2D3E2D] animate-spin mb-6" />
            <p className="text-[#2D3E2D] font-bold text-2xl tracking-tighter">AI Processing Receipt...</p>
          </div>
        ) : isCameraActive ? (
          <div className="relative w-full h-[600px] bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-12">
              <div className="w-full max-w-[320px] aspect-[1/2] border-2 border-[#D9ED92]/50 rounded-2xl relative shadow-[0_0_0_100vw_rgba(0,0,0,0.4)]">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#D9ED92] rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#D9ED92] rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#D9ED92] rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#D9ED92] rounded-br-xl"></div>
              </div>
            </div>
            {isFlashing && <div className="absolute inset-0 bg-white z-50"></div>}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-6">
              <button 
                onClick={stopCamera}
                className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white"
              >
                <X size={24} />
              </button>
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 bg-white rounded-full border-[6px] border-[#D9ED92] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                <div className="w-12 h-12 bg-[#2D3E2D] rounded-full flex items-center justify-center"><Scan className="text-[#D9ED92]" size={24} /></div>
              </button>
              <div className="w-16"></div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-[500px] flex flex-col items-center justify-center p-12 cursor-pointer bg-white group"
          >
            <input type="file" ref={fileInputRef} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => processImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} className="hidden" accept="image/*" />
            <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-[#D9ED92]/20 transition-all border border-gray-100">
              <Upload className="text-gray-400 group-hover:text-[#2D3E2D]" size={36} />
            </div>
            <h4 className="text-[#2D3E2D] font-bold text-3xl tracking-tight mb-3">Ready to Scan</h4>
            <p className="text-base text-gray-500 text-center max-w-sm">Tap the camera button or upload a photo to start digitalizing your business records.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptScanner;
