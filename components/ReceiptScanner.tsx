
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ICONS } from '../constants';
import { ScannedReceipt, ReceiptItem } from '../types';
import { Loader2, Upload, Camera, X, Scan, Trash2, Calendar, Save, RotateCcw } from 'lucide-react';

interface ReceiptScannerProps {
  onReceiptProcessed: (receipt: ScannedReceipt) => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onReceiptProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
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
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setPendingReceipt(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      alert("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 100);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
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
    }
  };

  if (pendingReceipt) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
        <div className="bg-[#2D3E2D] p-3 flex justify-between items-center text-white">
          <h2 className="font-bold flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
            <Scan size={14} className="text-[#D9ED92]" />
            Verifikasi Data
          </h2>
          <button onClick={() => setPendingReceipt(null)} className="hover:bg-white/10 p-1 rounded">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-3 border-b border-gray-100 grid grid-cols-2 gap-3 items-center bg-gray-50/30">
          <div>
             <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Nama Toko</label>
             <input 
               value={pendingReceipt.merchantName} 
               onChange={(e) => setPendingReceipt({...pendingReceipt, merchantName: e.target.value})}
               className="bg-transparent font-bold text-[#2D3E2D] text-xs w-full outline-none focus:text-green-800"
             />
          </div>
          <div className="text-right">
             <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Tanggal</label>
             <input 
               value={pendingReceipt.date} 
               onChange={(e) => setPendingReceipt({...pendingReceipt, date: e.target.value})}
               className="bg-transparent font-medium text-gray-600 text-[11px] w-full outline-none text-right"
             />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white border-b border-gray-100 shadow-sm z-10">
              <tr className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-3 py-2">Item</th>
                <th className="px-2 py-2 w-12 text-center">Qty</th>
                <th className="px-2 py-2 w-24 text-right">Price</th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingReceipt.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 group">
                  <td className="px-3 py-1.5">
                    <input 
                      value={item.name} 
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      className="w-full bg-transparent text-[11px] font-medium text-gray-700 outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input 
                      type="number"
                      value={item.quantity} 
                      onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                      className="w-full bg-transparent text-[11px] text-center outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input 
                      type="number"
                      value={item.unitPrice} 
                      onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value))}
                      className="w-full bg-transparent text-[11px] text-right font-bold text-[#2D3E2D] outline-none"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Subtotal</span>
            <span className="text-base font-black text-[#2D3E2D]">Rp{pendingReceipt.grandTotal.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setPendingReceipt(null); startCamera(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:text-gray-800 transition-colors"
            >
              <RotateCcw size={12} />
              Rescan
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#D9ED92] text-[#2D3E2D] px-4 py-1.5 rounded-md font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              <Save size={14} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto overflow-hidden">
      {isProcessing ? (
        <div className="h-[300px] flex flex-col items-center justify-center p-6 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#2D3E2D] animate-spin" />
          <div>
            <h3 className="text-sm font-bold text-[#2D3E2D]">Gemini sedang membaca...</h3>
            <p className="text-[10px] text-gray-400">Digitalisasi struk sedang diproses.</p>
          </div>
        </div>
      ) : isCameraActive ? (
        <div className="relative h-[350px] sm:h-[400px] bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-72 border border-[#D9ED92]/30 rounded shadow-[0_0_0_100vw_rgba(0,0,0,0.5)]"></div>
          </div>
          {isFlashing && <div className="absolute inset-0 bg-white z-50"></div>}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
            <button onClick={stopCamera} className="w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
              <X size={16} />
            </button>
            <button 
              onClick={capturePhoto}
              className="w-12 h-12 bg-white rounded-full border-2 border-[#D9ED92] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-8 h-8 bg-[#2D3E2D] rounded-full flex items-center justify-center"><Camera className="text-[#D9ED92]" size={16} /></div>
            </button>
            <div className="w-8"></div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold">Input Data Struk</h3>
              <p className="text-[10px] text-gray-500 tracking-tight">AI akan mengekstrak data dari struk Anda.</p>
            </div>
            <div className="flex gap-2">
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-md text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Upload size={12} />
                Upload
              </button>
              <button 
                onClick={startCamera}
                className="flex items-center gap-1.5 bg-[#2D3E2D] text-[#D9ED92] px-3 py-1.5 rounded-md text-[10px] font-bold hover:brightness-125 transition-all"
              >
                <Camera size={12} />
                Kamera
              </button>
            </div>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-50 rounded-lg p-8 text-center hover:border-[#D9ED92] hover:bg-green-50/10 transition-all cursor-pointer group"
          >
            <input type="file" ref={fileInputRef} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => processImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} className="hidden" accept="image/*" />
            <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-50 transition-colors">
              <Scan className="text-gray-300 group-hover:text-[#2D3E2D]" size={20} />
            </div>
            <p className="text-[11px] font-medium text-gray-400 group-hover:text-gray-500">Klik atau drop foto struk di sini</p>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ReceiptScanner;
