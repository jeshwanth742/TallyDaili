import { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
    title: string;
    initialValue?: string;
    placeholder?: string;
    type?: 'text' | 'number';
    shouldCloseOnSave?: boolean;
}

export const InputModal = ({
    isOpen,
    onClose,
    onSave,
    title,
    initialValue = '',
    placeholder = '',
    type = 'text',
    shouldCloseOnSave = true
}: InputModalProps) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 100);
        }
    }, [isOpen, initialValue, title, type]); // Reset on title/type change too

    if (!isOpen) return null;

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        onSave(value);
        if (shouldCloseOnSave) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-xs bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-text-secondary text-[10px] uppercase tracking-[0.2em] font-black opacity-60 ml-1">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-secondary">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        ref={inputRef}
                        type={type}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-neutral-900/50 border border-white/5 rounded-2xl p-4 text-white text-lg font-bold font-mono focus:border-primary/50 focus:outline-none transition-all text-center"
                    />

                    <button
                        type="submit"
                        className="w-full bg-primary text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={16} strokeWidth={3} />
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};
