import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Upload, Scan, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CATEGORIES } from '@/types';
import { useStore } from '@/store';

interface ReceiptScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScannedData {
  amount: string;
  merchant: string;
  date: string;
  category: string;
}

export const ReceiptScanner = ({ isOpen, onClose }: ReceiptScannerProps) => {
  const { addTransaction, accounts } = useStore();
  const [step, setStep] = useState<'camera' | 'review' | 'processing'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<ScannedData>({
    amount: '',
    merchant: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Other'
  });
  const [, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file input if camera access fails
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
        processReceipt(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        processReceipt(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processReceipt = async (_imageData: string) => {
    setStep('processing');
    setIsProcessing(true);

    // Simulate AI processing (in a real app, this would call an OCR API)
    setTimeout(() => {
      // Mock extracted data - in reality this would come from OCR
      const mockData: ScannedData = {
        amount: (Math.random() * 100 + 5).toFixed(2),
        merchant: ['Harris Teeter', 'UNCP Bookstore', 'Subway', 'Starbucks', 'Target'][Math.floor(Math.random() * 5)],
        date: new Date().toISOString().split('T')[0],
        category: ['Groceries', 'School/Books', 'Dining', 'Entertainment', 'Shopping'][Math.floor(Math.random() * 5)]
      };
      
      setScannedData(mockData);
      setIsProcessing(false);
      setStep('review');
    }, 2000);
  };

  const handleSaveTransaction = () => {
    const checkingAccount = accounts.find(a => a.type === 'checking');
    if (checkingAccount && scannedData.amount && scannedData.merchant) {
      const transaction = {
        id: Date.now().toString(),
        accountId: checkingAccount.id,
        amount: parseFloat(scannedData.amount),
        description: scannedData.merchant,
        category: scannedData.category as any,
        type: 'debit' as const,
        createdAt: new Date(scannedData.date).toISOString(),
        notes: 'Added via receipt scanner'
      };
      
      addTransaction(transaction);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setStep('camera');
    setCapturedImage(null);
    setScannedData({
      amount: '',
      merchant: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Other'
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {step === 'camera' && 'Scan Receipt'}
                {step === 'processing' && 'Processing Receipt'}
                {step === 'review' && 'Review & Save'}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4">
              {step === 'camera' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      Take a photo of your receipt or upload an existing image
                    </p>
                  </div>

                  {/* Camera View */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      onLoadedMetadata={startCamera}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Camera overlay */}
                    <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <Scan className="w-8 h-8 mx-auto mb-2 opacity-80" />
                        <p className="text-sm opacity-80">Position receipt here</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={capturePhoto}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Capture
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Scan className="w-8 h-8 text-primary" />
                    </motion.div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Scanning Receipt...
                  </h4>
                  <p className="text-gray-600">
                    We're extracting the details from your receipt
                  </p>
                  
                  {capturedImage && (
                    <div className="mt-4">
                      <img
                        src={capturedImage}
                        alt="Captured receipt"
                        className="w-32 h-32 object-cover rounded-lg mx-auto border"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'review' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-600">Receipt scanned successfully! Review the details:</p>
                  </div>

                  {capturedImage && (
                    <div className="text-center mb-4">
                      <img
                        src={capturedImage}
                        alt="Captured receipt"
                        className="w-24 h-24 object-cover rounded-lg mx-auto border"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={scannedData.amount}
                          onChange={(e) => setScannedData(prev => ({ ...prev, amount: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="merchant">Merchant</Label>
                      <Input
                        id="merchant"
                        value={scannedData.merchant}
                        onChange={(e) => setScannedData(prev => ({ ...prev, merchant: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={scannedData.category}
                        onChange={(e) => setScannedData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="date"
                          type="date"
                          value={scannedData.date}
                          onChange={(e) => setScannedData(prev => ({ ...prev, date: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleSaveTransaction}
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={!scannedData.amount || !scannedData.merchant}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save Transaction
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setStep('camera')}
                      className="flex-1"
                    >
                      Retake
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
