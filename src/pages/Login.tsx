
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Clock, Phone, Globe } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" })
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Check if user is already logged in
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsLoggedIn(true);
      navigate('/admin');
    }
  }, [navigate]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Hard-coded admin credentials
    if (data.username === 'admin' && data.password === 'prince@123') {
      localStorage.setItem('adminLoggedIn', 'true');
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      navigate('/admin');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Restaurant Info Section */}
          <div className="w-full md:w-3/5 bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <Logo />
              <h1 className="text-2xl font-bold text-hungerzblue mt-4">Welcome to Hungerz Hub</h1>
              <p className="text-gray-600">The taste what you want...</p>
            </div>
            
            <div className="space-y-6 mt-8">
              <div className="flex items-start gap-3">
                <MapPin className="text-hungerzorange min-w-6" size={24} />
                <p className="text-gray-700">
                  Mid Town Plaza, 12, Safidon Gate, Rani Talab, Jind, Haryana 126102
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="text-hungerzorange min-w-6" size={24} />
                <div>
                  <h3 className="font-medium">Business Hours</h3>
                  <p className="text-gray-700">Monday - Sunday: 10:00 AM - 10:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="text-hungerzorange min-w-6" size={24} />
                <p className="text-gray-700">+91 98765 43210</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Globe className="text-hungerzorange min-w-6" size={24} />
                <p className="text-gray-700">www.hungerzhub.com</p>
              </div>
              
              <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  className="bg-hungerzorange hover:bg-hungerzorange/90"
                  onClick={() => navigate('/menu')}
                >
                  View Our Menu
                </Button>
                <Button
                  variant="outline"
                  className="border-hungerzblue text-hungerzblue hover:bg-hungerzblue/10"
                  onClick={() => navigate('/qr-generator')}
                >
                  Table QR Codes
                </Button>
              </div>
            </div>
          </div>
          
          {/* Login Card */}
          <div className="w-full md:w-2/5">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center">Admin Login</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full bg-hungerzblue hover:bg-hungerzblue/90">
                      Login
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">Default: admin / prince@123</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <footer className="bg-hungerzblue text-white py-4 mt-10">
        <div className="container mx-auto text-center">
          <p>© 2025 Hungerz Hub - The taste what you want...</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
