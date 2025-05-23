
"use client";
import React, { useState } from 'react';
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
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [enableCloudSync, setEnableCloudSync] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Assuming a theme context would handle this in a real app
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleProfileSave = () => {
    toast({ title: "Profile Updated", description: "Your profile information has been saved (Placeholder)." });
  };

  const handleChangePassword = () => {
    toast({ title: "Password Changed", description: "Your password has been updated (Placeholder)." });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would trigger a confirmation dialog.
    toast({ title: "Account Deletion", description: "Account deletion initiated (Placeholder).", variant: "destructive" });
  };

  const handleSyncNow = () => {
    if (enableCloudSync) {
      toast({ title: "Syncing Data...", description: "Your data is being synced with the cloud (Placeholder)." });
    } else {
      toast({ title: "Cloud Sync Disabled", description: "Please enable cloud sync first.", variant: "destructive"});
    }
  };

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    // In a real app, this would likely call a function from a theme context
    // to toggle 'dark' class on HTML element and save preference.
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast({ title: "Theme Changed", description: `Dark mode ${checked ? 'enabled' : 'disabled'}.` });
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe (Placeholder)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com (Placeholder)" />
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
                <Select defaultValue="INR">
                    <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                        <SelectItem value="USD">USD - United States Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
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
                  Securely back up and sync your data across devices (Feature Placeholder).
                </p>
              </div>
              <Switch 
                id="cloud-sync" 
                checked={enableCloudSync} 
                onCheckedChange={setEnableCloudSync} 
                aria-label="Toggle cloud sync" 
              />
            </div>
            <Button onClick={handleSyncNow} disabled={!enableCloudSync}>Sync Now (Placeholder)</Button>
            <p className="text-xs text-muted-foreground">
                Your data is currently saved locally on this device. Enabling cloud sync will allow you to access it elsewhere.
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
                 <p className="text-xs text-muted-foreground mt-2">This action is irreversible.</p>
            </div>
          </CardContent>
        </Card>

    </div>
  );
}
