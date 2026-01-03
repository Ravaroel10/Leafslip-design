
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ICONS } from '../constants';
import { ScannedReceipt } from '../types';
import { Loader2, Upload, FileText, CheckCircle2, Camera, X, RefreshCw, Scan, AlertTriangle } from 'lucide-react';

interface ReceiptScannerProps {
  onReceiptProcessed: (receipt: ScannedReceipt) => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onReceiptProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Synchronize stream to video element whenever camera becomes active
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      
      streamRef.current = stream;
      setIsCameraActive(true);
      setPreview(null);
    } catch (err) {
      console.error("Camera access error:", err);
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
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data.split(',')[1]
              }
            },
            {
              text: "Extract data from this Indonesian receipt. Return valid JSON only with this schema: { merchantName: string, date: string, items: [{name: string, quantity: number, unitPrice: number, total: number}], grandTotal: number, category: 'Fresh'|'Dry'|'Beverage'|'Other' }. Ensure item names are clean and translated to English if possible, but keep merchant name as is. If certain fields are missing, provide best guesses or 'N/A'."
            }
          ]
        },
        config: {
            responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      const receipt: ScannedReceipt = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      onReceiptProcessed(receipt);
    } catch (error) {
      console.error("Scanning error:", error);
      alert("Failed to process receipt. Please ensure it's a clear photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-[40px] shadow-xl p-8 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <span className="p-2 bg-[#D9ED92] rounded-xl">{ICONS.Camera}</span>
            Leafslip Scanner
          </h3>
          <p className="text-gray-500 mt-1">Capture or upload your paper receipts</p>
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

      <div className="relative overflow-hidden rounded-[32px] bg-gray-950 border-2 border-dashed border-gray-200 min-h-[400px] flex flex-col items-center justify-center transition-all group">
        
        <canvas ref={canvasRef} className="hidden" />

        {isProcessing ? (
          <div className="text-center animate-pulse p-12 bg-white w-full h-full absolute inset-0 z-30 flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-[#2D3E2D] animate-spin mb-6" />
            <p className="text-[#2D3E2D] font-bold text-2xl tracking-tighter">AI Formatter Thinking...</p>
            <p className="text-sm text-gray-400 mt-2 italic">Converting physical ink into digital data</p>
          </div>
        ) : isCameraActive ? (
          <div className="relative w-full h-[500px] bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-12">
              <div className="w-full max-w-[300px] aspect-[1/2] border-2 border-[#D9ED92]/50 rounded-2xl relative shadow-[0_0_0_100vw_rgba(0,0,0,0.4)]">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#D9ED92] rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#D9ED92] rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#D9ED92] rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#D9ED92] rounded-br-xl"></div>
                
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-[10px] text-white/80 bg-black/40 px-3 py-1 rounded-full uppercase tracking-widest font-bold backdrop-blur-sm">
                    Align Receipt Here
                  </span>
                </div>
              </div>
            </div>

            {isFlashing && <div className="absolute inset-0 bg-white z-50 transition-opacity"></div>}

            <div className="absolute bottom-8 left-0 right-0 flex justify-center px-6">
              <div className="bg-black/40 backdrop-blur-xl p-4 rounded-full border border-white/20 flex items-center gap-6">
                 <button 
                  onClick={stopCamera}
                  className="p-3 text-white/60 hover:text-white transition-colors"
                 >
                   <X size={24} />
                 </button>
                 <button 
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-white rounded-full border-[6px] border-[#D9ED92] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                >
                  <div className="w-12 h-12 bg-[#2D3E2D] rounded-full flex items-center justify-center group-active:scale-90 transition-transform">
                    <Scan className="text-[#D9ED92]" size={24} />
                  </div>
                </button>
                <div className="w-10"></div>
              </div>
            </div>

            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-[0.2em] border border-white/10">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live MSME Scanner
            </div>
          </div>
        ) : preview ? (
          <div className="relative w-full h-[500px] overflow-hidden">
            <img src={preview} className="w-full h-full object-cover grayscale opacity-40 blur-[2px]" alt="Captured" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#2D3E2D] p-8 text-center">
              <div className="w-20 h-20 bg-[#D9ED92] rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-3xl font-bold tracking-tighter mb-2">Analyzing Slip...</h4>
              <p className="text-gray-600 max-w-xs mb-8">
                Gemini AI is parsing items, quantities, and Indonesian Rupiah values.
              </p>
              <button 
                onClick={() => { setPreview(null); startCamera(); }}
                className="bg-[#2D3E2D] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:brightness-125 transition-all"
              >
                Cancel Processing
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-[400px] flex flex-col items-center justify-center p-12 cursor-pointer bg-white group hover:bg-gray-50 transition-all"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-[#D9ED92]/20 transition-all border border-gray-100 group-hover:border-[#D9ED92]/50">
              <Upload className="text-gray-400 group-hover:text-[#2D3E2D]" size={36} />
            </div>
            <h4 className="text-[#2D3E2D] font-bold text-2xl tracking-tight mb-2">Digitize Your Business</h4>
            <p className="text-sm text-gray-500 max-w-sm text-center">
              Upload existing receipt photos or tap the <span className="font-bold text-[#2D3E2D]">Scan</span> button above to use your camera in real-time.
            </p>
            
            {error && (
              <div className="mt-6 text-red-500 text-xs font-medium bg-red-50 px-5 py-2.5 rounded-full border border-red-100 flex items-center gap-2">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50/80 p-6 rounded-[32px] border border-gray-100">
           <div className="flex items-center gap-2 mb-3">
             <div className="p-1.5 bg-[#2D3E2D] rounded-lg">
                <FileText className="w-3.5 h-3.5 text-[#D9ED92]" />
             </div>
             <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Smart Archiving</span>
           </div>
           <p className="text-xs text-gray-500 leading-relaxed">
             Scanned data is automatically categorized into Fresh, Dry, and Beverage groups for easier inventory tracking.
           </p>
        </div>
        <div className="bg-[#D9ED92]/10 p-6 rounded-[32px] border border-[#D9ED92]/30">
           <div className="flex items-center gap-2 mb-3">
             <div className="p-1.5 bg-[#D9ED92] rounded-lg">
                <RefreshCw className="w-3.5 h-3.5 text-[#2D3E2D]" />
             </div>
             <span className="text-[10px] font-bold uppercase text-[#2D3E2D] tracking-wider">Cloud Sync</span>
           </div>
           <div className="text-xl font-bold text-[#2D3E2D] tracking-tighter">Real-time Updates</div>
           <p className="text-[10px] text-gray-600 mt-1 opacity-70">Your inventory reflects new scans in under 3 seconds.</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
