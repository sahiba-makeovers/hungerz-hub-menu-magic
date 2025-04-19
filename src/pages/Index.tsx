
import React from 'react';
import { OrderProvider } from '@/contexts/OrderContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { QrCode, Utensils, Server, Menu as MenuIcon, Star, Bell, Book, Map } from 'lucide-react';

const Index = () => {
  return (
    <OrderProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm p-4">
          <div className="container mx-auto flex justify-center items-center">
            <Logo />
          </div>
        </header>
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-cover bg-center h-96" style={{ 
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1274&q=80')" 
        }}>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hungerz Hub <span className="text-hungerzorange">Menu Magic</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl">
              Experience the culinary delight at your fingertips. Scan, order, and enjoy!
            </p>
            <Link to="/menu">
              <Button size="lg" className="bg-hungerzorange hover:bg-hungerzorange/90 text-white px-8 py-6 text-lg">
                View Our Menu
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-hungerzblue mb-12">What Makes Us Special</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Utensils size={24} className="text-hungerzblue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Delicious Food</h3>
                <p className="text-gray-600">
                  Our chefs prepare every dish with passion and using only the freshest ingredients.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <QrCode size={24} className="text-hungerzorange" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Digital Ordering</h3>
                <p className="text-gray-600">
                  Scan the QR code at your table and place your order digitally without waiting.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Bell size={24} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick Service</h3>
                <p className="text-gray-600">
                  Our staff is dedicated to providing you with the fastest and most efficient service.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Popular Menu Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-hungerzblue mb-4">Our Popular Dishes</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Try our most loved dishes that keep our customers coming back for more
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
                    alt="Double Decker Cheesy Burger" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">Double Decker Cheesy Burger</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-gray-600 text-sm">aloo tikki, herb chili patty, onion, tomato, cheese slice, sauces</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-hungerzorange">₹100</span>
                    <Link to="/menu">
                      <Button variant="outline" className="text-hungerzblue border-hungerzblue">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Margherita Pizza" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">Margherita Pizza</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                  <p className="text-gray-600 text-sm">Only Cheese</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-hungerzorange">₹80 - ₹120</span>
                    <Link to="/menu">
                      <Button variant="outline" className="text-hungerzblue border-hungerzblue">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="VEG. HH TANDOORI PLATTER" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">VEG. HH TANDOORI PLATTER</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-gray-600 text-sm">PANEER+MUSHROOM+CHAAP+SALAD</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-hungerzorange">₹300</span>
                    <Link to="/menu">
                      <Button variant="outline" className="text-hungerzblue border-hungerzblue">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-10">
              <Link to="/menu">
                <Button className="bg-hungerzblue hover:bg-hungerzblue/90">
                  <MenuIcon size={16} className="mr-2" />
                  View Full Menu
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Restaurant Info Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-hungerzblue mb-4">Visit Our Restaurant</h2>
                <p className="text-gray-600 mb-6">
                  Experience the warm ambience and exceptional service at Hungerz Hub. Our restaurant offers comfortable seating, a friendly atmosphere, and of course, delicious food that will keep you coming back.
                </p>
                
                <div className="flex items-start gap-4 mb-4">
                  <Map className="text-hungerzorange h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Find Us</h4>
                    <p className="text-gray-600">123 Food Street, Culinary District, Foodie City</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 mb-4">
                  <Book className="text-hungerzorange h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Opening Hours</h4>
                    <p className="text-gray-600">Monday - Sunday: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Bell className="text-hungerzorange h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Reservations</h4>
                    <p className="text-gray-600">Call us at: +91 98765 43210</p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Restaurant Interior" 
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* App Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-hungerzblue mb-12">Our Digital Restaurant Service</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <QrCode size={28} className="text-hungerzblue" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">QR Code Generator</h2>
                  <p className="text-gray-600 mb-4">
                    Generate unique QR codes for each table that customers can scan to view the menu.
                  </p>
                  <Link to="/qr-generator" className="mt-auto">
                    <Button className="bg-hungerzblue hover:bg-hungerzblue/90">
                      Generate QR Codes
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Utensils size={28} className="text-hungerzorange" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Digital Menu</h2>
                  <p className="text-gray-600 mb-4">
                    Browse the digital menu, add items to cart, and place orders directly from the table.
                  </p>
                  <Link to="/menu" className="mt-auto">
                    <Button className="bg-hungerzorange hover:bg-hungerzorange/90">
                      View Menu
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Server size={28} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
                  <p className="text-gray-600 mb-4">
                    Manage incoming orders, update order statuses, and keep track of all restaurant activities.
                  </p>
                  <Link to="/login" className="mt-auto">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Admin Login
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <footer className="bg-hungerzblue text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <Logo />
                <p className="mt-2">The taste what you want...</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 text-center md:text-left">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><Link to="/" className="hover:text-hungerzorange transition-colors">Home</Link></li>
                    <li><Link to="/menu" className="hover:text-hungerzorange transition-colors">Menu</Link></li>
                    <li><Link to="/qr-generator" className="hover:text-hungerzorange transition-colors">QR Generator</Link></li>
                    <li><Link to="/login" className="hover:text-hungerzorange transition-colors">Admin</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                  <ul className="space-y-2">
                    <li>123 Food Street, Culinary District</li>
                    <li>Phone: +91 98765 43210</li>
                    <li>Email: info@hungerzhub.com</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 mt-8 pt-8 text-center">
              <p>© 2025 Hungerz Hub - The taste what you want...</p>
            </div>
          </div>
        </footer>
      </div>
    </OrderProvider>
  );
};

export default Index;
