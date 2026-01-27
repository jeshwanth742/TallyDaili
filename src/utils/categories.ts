import { Utensils, Car, Zap, Film, ShoppingBag, Heart, MoreHorizontal, GraduationCap, Plane, PiggyBank, User, Home, Fuel, type LucideIcon } from 'lucide-react';

export interface Category {
    id: string;
    label: string;
    icon: LucideIcon;
    color?: string; // Future proofing for custom colors
}

export const CATEGORIES: Category[] = [
    { id: 'Food', label: 'Food', icon: Utensils },
    { id: 'Rent', label: 'Rent', icon: Home },
    { id: 'Transport', label: 'Trans', icon: Car },
    { id: 'Gas', label: 'Gas', icon: Fuel },
    { id: 'Utilities', label: 'Util', icon: Zap },
    { id: 'Entertainment', label: 'Ent', icon: Film },
    { id: 'Shopping', label: 'Shop', icon: ShoppingBag },
    { id: 'Health', label: 'Health', icon: Heart },
    { id: 'Education', label: 'Edu', icon: GraduationCap },
    { id: 'Travel', label: 'Travel', icon: Plane },
    { id: 'Savings', label: 'Save', icon: PiggyBank },
    { id: 'Personal', label: 'Pers', icon: User },
    { id: 'Others', label: 'Others', icon: MoreHorizontal },
];

export const getCategoryIcon = (id: string): LucideIcon => {
    const category = CATEGORIES.find(c => c.id === id);
    return category ? category.icon : MoreHorizontal;
};
