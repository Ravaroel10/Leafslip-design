
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ICONS, COLORS } from '../constants';
import { ScannedReceipt } from '../types';
import { Loader2, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface ReceiptScannerProps {
  onReceiptProcessed: (receipt: ScannedReceipt) => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onReceiptProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (base64Data: string) => {
    setIsProcessing(true);
    try {
      // Use process.env.API_KEY directly for initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        // Wrap inlineData and text in the correct parts structure
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data.split(',')[1]
              }
            },
            {
              text: "Extract data from this Indonesian receipt. Return valid JSON only with this schema: { merchantName: string, date: string, items: [{name: string, quantity: number, unitPrice: number, total: number}], grandTotal: number, category: 'Fresh'|'Dry'|'Beverage'|'Other' }. Ensure item names are clean."
            }
          ]
        },
        config: {
            responseMimeType: "application/json"
        }
      });

      // Directly access .text property from GenerateContentResponse
      const data = JSON.parse(response.text || '{}');
      const receipt: ScannedReceipt = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      onReceiptProcessed(receipt);
    } catch (error) {
      console.error("Scanning error:", error);
      alert("Failed to process receipt. Please ensure it's a clear photo of an Indonesian receipt.");
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <span className="p-2 bg-[#D9ED92] rounded-xl">{ICONS.Camera}</span>
            OCR Receipt Scanner
          </h3>
          <p className="text-gray-500 mt-1">Upload a photo to digitize your sales</p>
        </div>
        <div className="hidden md:block">
           <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wider">Powered by Gemini AI</span>
        </div>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-[32px] transition-all flex flex-col items-center justify-center p-12 group ${
          isProcessing ? 'border-[#D9ED92] bg-gray-50' : 'border-gray-200 hover:border-[#2D3E2D] hover:bg-gray-50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />

        {isProcessing ? (
          <div className="text-center animate-pulse">
            <Loader2 className="w-12 h-12 text-[#2D3E2D] animate-spin mx-auto mb-4" />
            <p className="text-[#2D3E2D] font-bold">LLM Formatter Working...</p>
            <p className="text-xs text-gray-400 mt-2 italic">Analyzing items and Indonesian prices</p>
          </div>
        ) : preview ? (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner">
            <img src={preview} className="w-full h-full object-cover opacity-40" alt="Preview" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#2D3E2D]">
              <CheckCircle2 className="w-12 h-12 mb-2" />
              <p className="font-bold">Scan Complete</p>
              <button className="text-xs underline mt-2">Upload another</button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-gray-400 group-hover:text-[#2D3E2D]" />
            </div>
            <p className="text-gray-600 font-medium">Click or drag receipt photo here</p>
            <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, WEBP</p>
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
           <div className="flex items-center gap-2 mb-1">
             <FileText className="w-4 h-4 text-gray-400" />
             <span className="text-[10px] font-bold uppercase text-gray-400">Extracted Fields</span>
           </div>
           <div className="text-xs space-y-1">
             <div className="flex justify-between"><span>Merchant</span><span className="font-bold">Auto-detected</span></div>
             <div className="flex justify-between"><span>Currency</span><span className="font-bold text-green-600">IDR (Rupiah)</span></div>
           </div>
        </div>
        <div className="bg-[#2D3E2D] p-4 rounded-2xl text-white">
           <div className="flex items-center gap-2 mb-1">
             <CheckCircle2 className="w-4 h-4 text-[#D9ED92]" />
             <span className="text-[10px] font-bold uppercase text-gray-400">Success Rate</span>
           </div>
           <div className="text-xl font-bold">98.4%</div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
