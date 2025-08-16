import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockData, Issue, Event, Feedback, Announcement } from "@/data/mockData";

interface AppContextType {
  // Data
  issues: Issue[];
  events: Event[];
  feedback: Feedback[];
  announcements: Announcement[];
  
  // Auth
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  
  // Issue management
  updateIssue: (id: number, updates: Partial<Issue>) => void;
  addIssue: (issue: Omit<Issue, 'id'>) => void;
  
  // Feedback management
  addFeedback: (feedback: Omit<Feedback, 'id'>) => void;
  updateFeedbackStatus: (id: number, status: Feedback['status']) => void;
  
  // Event management
  addEvent: (event: Omit<Event, 'id'>) => void;
  
  // Announcement management
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>(mockData.issues);
  const [events, setEvents] = useState<Event[]>(mockData.events);
  const [feedback, setFeedback] = useState<Feedback[]>(mockData.feedback);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockData.announcements);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const updateIssue = (id: number, updates: Partial<Issue>) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, ...updates } : issue
    ));
  };
  
  const addIssue = (issue: Omit<Issue, 'id'>) => {
    const newIssue = {
      ...issue,
      id: Math.max(...issues.map(i => i.id)) + 1,
    };
    setIssues(prev => [newIssue, ...prev]);
  };
  
  const addFeedback = (newFeedback: Omit<Feedback, 'id'>) => {
    const newFeedbackItem = {
      ...newFeedback,
      id: Math.max(...feedback.map(f => f.id)) + 1,
    };
    setFeedback(prev => [newFeedbackItem, ...prev]);
  };
  
  const updateFeedbackStatus = (id: number, status: Feedback['status']) => {
    setFeedback(prev => prev.map(f => 
      f.id === id ? { ...f, status } : f
    ));
  };
  
  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: Math.max(...events.map(e => e.id)) + 1,
    };
    setEvents(prev => [newEvent, ...prev]);
  };
  
  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement = {
      ...announcement,
      id: Math.max(...announcements.map(a => a.id)) + 1,
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        issues,
        events,
        feedback,
        announcements,
        isAdmin,
        setIsAdmin,
        updateIssue,
        addIssue,
        addFeedback,
        updateFeedbackStatus,
        addEvent,
        addAnnouncement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};