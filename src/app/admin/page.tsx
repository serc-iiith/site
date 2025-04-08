"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  ClipboardList,
  Handshake,
  Newspaper,
  CalendarClock,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

import EditPeople from '@/components/admin/EditPeople';
import EditEvents from '@/components/admin/EditEvents';
import EditProjects from '@/components/admin/EditProjects';
import EditPapers from '@/components/admin/EditPapers';
import EditCollaborators from '@/components/admin/EditCollaborators';
import EditBlogs from '@/components/admin/EditBlogs';

// Dummy data - would be fetched from API in a real app
const initialPeople = [
  { id: 1, name: "John Doe", title: "Professor", email: "john@example.com", imageURL: "" },
  { id: 2, name: "Jane Smith", title: "Research Associate", email: "jane@example.com", imageURL: "" },
];

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('people');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [people, setPeople] = useState(initialPeople);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    title: '',
    email: '',
    imageURL: '',
  });
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Authentication would be required here

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const startEditing = (person: any) => {
    setEditingId(person.id);
    setFormData(person);
    if (isMobile) setSidebarOpen(false);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ id: 0, name: '', title: '', email: '', imageURL: '' });
  };

  const savePerson = () => {
    if (editingId) {
      // Update existing person
      setPeople(people.map(p => p.id === editingId ? formData : p));
    } else {
      // Add new person
      const newId = Math.max(0, ...people.map(p => p.id)) + 1;
      setPeople([...people, { ...formData, id: newId }]);
    }
    cancelEditing();
  };

  const deletePerson = (id: number) => {
    setPeople(people.filter(p => p.id !== id));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'people':
        return <EditPeople />
      case 'events':
        return <EditEvents />
      case 'projects':
        return <EditProjects />
      case 'research':
        return <EditPapers />
      case 'collaborators':
        return <EditCollaborators />
      case 'blog':
        return <EditBlogs />
      default:
        return null;
    }
  };

  const sidebarItems = [
    { id: 'people', name: 'People', icon: <Users size={20} /> },
    { id: 'research', name: 'Research', icon: <BookOpen size={20} /> },
    { id: 'projects', name: 'Projects', icon: <ClipboardList size={20} /> },
    { id: 'collaborators', name: 'Collaborators', icon: <Handshake size={20} /> },
    { id: 'blog', name: 'Blog', icon: <Newspaper size={20} /> },
    { id: 'events', name: 'Events', icon: <CalendarClock size={20} /> },
  ];

  return (
    <div className="min-h-screen pt-16 bg-[color:var(--foreground)]">

      <div className="flex relative">
        {/* Sidebar - hidden on mobile */}
        <motion.aside
          className={`hidden md:block bg-[color:var(--background)] border-r border-[color:var(--border-color)] 
            sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto`}
          initial={{ width: sidebarOpen ? 256 : 64 }}
          animate={{ width: sidebarOpen ? 256 : 64 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="px-4 py-6 flex justify-between items-center">
            <motion.h2
              className="text-lg font-bold text-[color:var(--text-color)]"
              initial={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
              animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              Admin Panel
            </motion.h2>
            <button
              className="p-2 rounded-md hover:bg-[color:var(--hover-bg)] text-[color:var(--text-color)]"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          <nav className="mt-5">
            <ul className="space-y-2 px-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 rounded-md transition-colors ${activeSection === item.id
                      ? 'bg-[color:var(--primary-color)] text-white'
                      : 'text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)]'
                      }`}
                  >
                    <span>{item.icon}</span>
                    <motion.span
                      className="ml-3 whitespace-nowrap overflow-hidden"
                      initial={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
                      animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {item.name}
                    </motion.span>
                  </button>
                </li>
              ))}
              <li className="pt-4 mt-6 border-t border-[color:var(--border-color)]">
                <Link
                  href="/"
                  className="w-full flex items-center px-4 py-2 text-[color:var(--error-color)] hover:bg-[color:var(--hover-bg)] rounded-md transition-colors"
                >
                  <span><LogOut size={20} /></span>
                  <motion.span
                    className="ml-3 whitespace-nowrap overflow-hidden"
                    initial={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
                    animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    Exit Admin
                  </motion.span>
                </Link>
              </li>
            </ul>
          </nav>
        </motion.aside>

        {/* Main Content - adjusted for mobile */}
        <div className="flex-1 w-full">
          <div className="p-4 sm:p-8 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              key={activeSection} // Force re-render animation when section changes
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}