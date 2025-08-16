import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { Category } from "@/data/mockData";
import { Camera, Send } from "lucide-react";

export const Report: React.FC = () => {
  const { toast } = useToast();
  const { addIssue } = useApp();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    imageUrl: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.location || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newIssue = {
      title: formData.title,
      category: formData.category as Category,
      location: formData.location,
      description: formData.description,
      imageUrl: formData.imageUrl,
      status: "Reported" as const,
      progress: 0,
      timeline: [{
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: "Reported"
      }],
      isUrgent: formData.category === "Water" || formData.title.toLowerCase().includes("burst"),
      reportedBy: "Citizen Report",
      reportedAt: new Date().toISOString()
    };

    addIssue(newIssue);
    
    const trackingId = `TR${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Report Submitted Successfully",
      description: `Your tracking ID is: ${trackingId}`,
    });

    // Reset form
    setFormData({
      title: "",
      category: "",
      location: "",
      description: "",
      imageUrl: ""
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <main className="max-w-content mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Report an Issue</h1>
          <p className="text-muted-foreground">Help us serve you better by reporting community issues</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Submit New Report
            </CardTitle>
            <CardDescription>
              Provide details about the issue you'd like to report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Category }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Water">💧 Water</SelectItem>
                    <SelectItem value="Electricity">⚡ Electricity</SelectItem>
                    <SelectItem value="Roads">🚧 Roads</SelectItem>
                    <SelectItem value="Waste">🗑️ Waste</SelectItem>
                    <SelectItem value="Other">❓ Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Street address or area"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the issue"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Photo URL (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/photo.jpg"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};