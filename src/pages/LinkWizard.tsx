import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store';

// Luhn algorithm for credit card validation
const luhnCheck = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

const step1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format'),
});

const step2Schema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  routingNumber: z.string().regex(/^\d{9}$/, 'Routing number must be 9 digits'),
  accountNumber: z.string().min(8, 'Account number must be at least 8 digits'),
  accountType: z.enum(['checking', 'savings']),
});

const step3Schema = z.object({
  cardNumber: z.string()
    .regex(/^\d{13,19}$/, 'Card number must be 13-19 digits')
    .refine(luhnCheck, 'Invalid card number'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
  cvc: z.string().regex(/^\d{3,4}$/, 'CVC must be 3-4 digits'),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;
type Step3Form = z.infer<typeof step3Schema>;

export const LinkWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Form | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Form | null>(null);
  const { setUser, setAccounts, setTransactions, addSavingsGoal, addNote, user } = useStore();
  const navigate = useNavigate();

  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
  });

  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
  });

  const step3Form = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
  });

  const onStep1Submit = (data: Step1Form) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const onStep2Submit = (data: Step2Form) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const onStep3Submit = (data: Step3Form) => {
    setStep3Data(data);
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    if (!step1Data || !step2Data || !step3Data || !user) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personal: step1Data,
          bank: step2Data,
          card: step3Data,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update user as linked
        setUser({ ...user, hasLinked: true });
        
        // Load demo data
        setAccounts(result.data.accounts);
        setTransactions(result.data.transactions);
        result.data.savingsGoals.forEach(addSavingsGoal);
        result.data.notes.forEach(addNote);
        
        // Show success and redirect
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(result.error || 'Linking failed');
      }
    } catch (error) {
      console.error('Linking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Details', description: 'Basic information' },
    { number: 2, title: 'Bank Account', description: 'Link your checking account' },
    { number: 3, title: 'Credit Card', description: 'Add your student card' },
    { number: 4, title: 'Review & Link', description: 'Confirm and connect' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-4 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Link Your Financial Accounts</CardTitle>
                <CardDescription>
                  We'll create demo accounts with sample data for your budgeting experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 1 && (
                  <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...step1Form.register('firstName')}
                          className={step1Form.formState.errors.firstName ? 'border-red-500' : ''}
                        />
                        {step1Form.formState.errors.firstName && (
                          <p className="text-sm text-red-500">
                            {step1Form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...step1Form.register('lastName')}
                          className={step1Form.formState.errors.lastName ? 'border-red-500' : ''}
                        />
                        {step1Form.formState.errors.lastName && (
                          <p className="text-sm text-red-500">
                            {step1Form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...step1Form.register('dateOfBirth')}
                        className={step1Form.formState.errors.dateOfBirth ? 'border-red-500' : ''}
                      />
                      {step1Form.formState.errors.dateOfBirth && (
                        <p className="text-sm text-red-500">
                          {step1Form.formState.errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ssn">Social Security Number</Label>
                      <Input
                        id="ssn"
                        placeholder="123-45-6789"
                        {...step1Form.register('ssn')}
                        className={step1Form.formState.errors.ssn ? 'border-red-500' : ''}
                      />
                      {step1Form.formState.errors.ssn && (
                        <p className="text-sm text-red-500">
                          {step1Form.formState.errors.ssn.message}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                )}

                {currentStep === 2 && (
                  <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="First National Bank"
                        {...step2Form.register('bankName')}
                        className={step2Form.formState.errors.bankName ? 'border-red-500' : ''}
                      />
                      {step2Form.formState.errors.bankName && (
                        <p className="text-sm text-red-500">
                          {step2Form.formState.errors.bankName.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          placeholder="123456789"
                          {...step2Form.register('routingNumber')}
                          className={step2Form.formState.errors.routingNumber ? 'border-red-500' : ''}
                        />
                        {step2Form.formState.errors.routingNumber && (
                          <p className="text-sm text-red-500">
                            {step2Form.formState.errors.routingNumber.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="12345678901"
                          {...step2Form.register('accountNumber')}
                          className={step2Form.formState.errors.accountNumber ? 'border-red-500' : ''}
                        />
                        {step2Form.formState.errors.accountNumber && (
                          <p className="text-sm text-red-500">
                            {step2Form.formState.errors.accountNumber.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <select
                        id="accountType"
                        {...step2Form.register('accountType')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goBack}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button type="submit">
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                )}

                {currentStep === 3 && (
                  <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        {...step3Form.register('cardNumber')}
                        className={step3Form.formState.errors.cardNumber ? 'border-red-500' : ''}
                      />
                      {step3Form.formState.errors.cardNumber && (
                        <p className="text-sm text-red-500">
                          {step3Form.formState.errors.cardNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          {...step3Form.register('expiryDate')}
                          className={step3Form.formState.errors.expiryDate ? 'border-red-500' : ''}
                        />
                        {step3Form.formState.errors.expiryDate && (
                          <p className="text-sm text-red-500">
                            {step3Form.formState.errors.expiryDate.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          {...step3Form.register('cvc')}
                          className={step3Form.formState.errors.cvc ? 'border-red-500' : ''}
                        />
                        {step3Form.formState.errors.cvc && (
                          <p className="text-sm text-red-500">
                            {step3Form.formState.errors.cvc.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        placeholder="John Doe"
                        {...step3Form.register('cardholderName')}
                        className={step3Form.formState.errors.cardholderName ? 'border-red-500' : ''}
                      />
                      {step3Form.formState.errors.cardholderName && (
                        <p className="text-sm text-red-500">
                          {step3Form.formState.errors.cardholderName.message}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goBack}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button type="submit">
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Review Your Information</h3>
                      <p className="text-sm text-gray-600">
                        We'll create demo accounts with sample transactions for your budgeting experience
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Personal Details</h4>
                        <p className="text-sm text-gray-600">
                          {step1Data?.firstName} {step1Data?.lastName}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Bank Account</h4>
                        <p className="text-sm text-gray-600">
                          {step2Data?.bankName} - {step2Data?.accountType}
                        </p>
                        <p className="text-sm text-gray-600">
                          ****{step2Data?.accountNumber.slice(-4)}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Credit Card</h4>
                        <p className="text-sm text-gray-600">
                          ****{step3Data?.cardNumber.slice(-4)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {step3Data?.cardholderName}
                        </p>
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-sm text-gray-600">
                          Creating your demo accounts and loading sample data...
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={goBack}>
                          <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={handleFinalSubmit} className="bg-primary hover:bg-primary/90">
                          Link Accounts & Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
