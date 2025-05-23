
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileDown, UserCircle, DollarSign } from "lucide-react";
import { loadUserInfo, saveUserInfo, type UserInfo, getCurrencySymbol } from '@/lib/data-store';
import { useCurrency } from '@/hooks/use-currency';

export default function SettingsPage() {
  const { toast } = useToast();
  const { currencySymbol, currencyCode, updateCurrency: refreshCurrencyHook } = useCurrency(); // Get currency utilities
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userIncome, setUserIncome] = useState<number | string>(''); // Can be string from input
  const [selectedCurrency, setSelectedCurrency] = useState('INR'); // Keep this for the Select component
  const [enableCloudSync, setEnableCloudSync] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [emailNotifications, setEmailNotifications] = useState(true);

  const loadSettingsData = useCallback(() => {
    const userInfo = loadUserInfo();
    if (userInfo) {
      setUserName(userInfo.name);
      setUserEmail(userInfo.email);
      setSelectedCurrency(userInfo.currency || 'INR');
      setUserIncome(userInfo.totalIncome ?? 0); // Default to 0 if not set
    }
  }, []);
  
  useEffect(() => {
    loadSettingsData();
  }, [loadSettingsData]);

  const handleProfileSave = useCallback(() => {
    if (!userName.trim() || !userEmail.trim()) {
      toast({ title: "Error", description: "Name and email cannot be empty.", variant: "destructive" });
      return;
    }
    const incomeValue = typeof userIncome === 'string' ? parseFloat(userIncome) : userIncome;
    if (isNaN(incomeValue) || incomeValue < 0) {
        toast({ title: "Error", description: "Income must be a valid positive number or zero.", variant: "destructive" });
        return;
    }

    const currentUserInfo = loadUserInfo(); // Get current to preserve other potential settings
    const updatedUserInfo: UserInfo = { 
        name: userName, 
        email: userEmail,
        currency: selectedCurrency,
        totalIncome: incomeValue,
    };
    saveUserInfo(updatedUserInfo);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    window.dispatchEvent(new Event('storage')); // Trigger storage event for other components
  }, [userName, userEmail, selectedCurrency, userIncome, toast]);

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    // Autosave currency change for immediate effect
    const currentUserInfo = loadUserInfo() || { name: '', email: '', totalIncome: 0 };
    saveUserInfo({ ...currentUserInfo, currency: value });
    toast({ title: "Currency preference updated", description: `Currency set to ${value}. Save profile to confirm other changes.`});
    window.dispatchEvent(new Event('storage')); // Trigger storage event for currency hook and other components
  };


  const handleChangePassword = () => {
    toast({ title: "Password Changed", description: "Your password has been updated (Placeholder)." });
  };

  const handleDeleteAccount = () => {
    toast({ title: "Account Deletion", description: "Account deletion initiated (Placeholder).", variant: "destructive" });
  };

  const handleSync = (method: string) => {
    if (enableCloudSync) {
      toast({ title: "Syncing Data...", description: `Your data is being synced with ${method} (Placeholder).` });
    } else {
      toast({ title: "Cloud Sync Disabled", description: "Please enable cloud sync first.", variant: "destructive"});
    }
  };

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', checked ? 'dark' : 'light');
    }
    toast({ title: "Theme Changed", description: `Dark mode ${checked ? 'enabled' : 'disabled'}.` });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
        } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        setDarkMode(false);
        }
    }
  }, []);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6" /> Profile Information</CardTitle>
            <CardDescription>Update your personal details and financial settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="your.email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalIncome">Estimated Monthly Income ({currencySymbol})</Label>
              <Input 
                id="totalIncome" 
                type="number" 
                step="0.01" 
                value={userIncome} 
                onChange={(e) => setUserIncome(e.target.value)} 
                placeholder="e.g., 50000.00" 
              />
            </div>
            <Button onClick={handleProfileSave}>Save Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your app experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark theme for the application.
                </p>
              </div>
              <Switch id="dark-mode" aria-label="Toggle dark mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="INR">INR - Indian Rupee ({getCurrencySymbol('INR')})</SelectItem>
                        <SelectItem value="USD">USD - United States Dollar ({getCurrencySymbol('USD')})</SelectItem>
                        <SelectItem value="EUR">EUR - Euro ({getCurrencySymbol('EUR')})</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound ({getCurrencySymbol('GBP')})</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar ({getCurrencySymbol('CAD')})</SelectItem>
                    </SelectContent>
                </Select>
            </div>

             <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summaries and budget alerts.
                </p>
              </div>
              <Switch id="notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} aria-label="Toggle email notifications" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Data Sync</CardTitle>
            <CardDescription>Manage how your data is stored and synchronized.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cloud-sync" className="text-base">Enable Cloud Sync</Label>
                <p className="text-sm text-muted-foreground">
                  Securely back up and sync your data across devices (Feature placeholder).
                </p>
              </div>
              <Switch 
                id="cloud-sync" 
                checked={enableCloudSync} 
                onCheckedChange={setEnableCloudSync} 
                aria-label="Toggle cloud sync" 
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={!enableCloudSync} variant="outline">
                  <UploadCloud className="mr-2 h-4 w-4" /> Sync Now
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleSync("Google Drive")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M18.5 12.5L12 19l-6.5-6.5"></path><path d="M12 19V3"></path><path d="M21.5 12.5H17L12 3 7 12.5H2.5L12 22l9.5-9.5z"></path></svg>
                  Sync with Google Drive (Placeholder)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSync("Local File")}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export to Local File (Placeholder)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-xs text-muted-foreground">
                Your data is currently saved locally on this device. Enabling cloud sync will allow you to access it elsewhere after syncing (once implemented).
            </p>
          </CardContent>
        </Card>

       <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <Button onClick={handleChangePassword}>Change Password</Button>
            <div className="border-t pt-4 mt-4">
                 <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
                 <p className="text-xs text-muted-foreground mt-2">This action is irreversible (Placeholder).</p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
