import { X, Check } from 'lucide-react';

interface NumericKeypadProps {
    value: string;
    onChange: (value: string) => void;
    onDone: () => void;
}

export const NumericKeypad = ({ value, onChange, onDone }: NumericKeypadProps) => {
    const handlePress = (num: string) => {
        if (num === '.' && value.includes('.')) return;
        if (value === '0' && num !== '.') {
            onChange(num);
        } else {
            onChange(value + num);
        }
    };

    const handleDelete = () => {
        if (value.length <= 1) {
            onChange('0');
        } else {
            onChange(value.slice(0, -1));
        }
    };

    return (
        <div className="grid grid-cols-4 gap-4 w-full select-none">
            {/* Numbers 7, 8, 9 */}
            {['7', '8', '9'].map(n => (
                <button
                    key={n}
                    onClick={() => handlePress(n)}
                    className="aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white text-3xl font-black font-mono active:scale-90 transition-all shadow-lg"
                >
                    {n}
                </button>
            ))}

            {/* Delete button (X icon) */}
            <button
                onClick={handleDelete}
                className="aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-text-secondary active:scale-95 transition-all shadow-lg"
            >
                <div className="p-2 bg-neutral-900 rounded-lg border border-white/5">
                    <X size={20} strokeWidth={3} />
                </div>
            </button>

            {/* Numbers 4, 5, 6 */}
            {['4', '5', '6'].map(n => (
                <button
                    key={n}
                    onClick={() => handlePress(n)}
                    className="aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white text-3xl font-black font-mono active:scale-90 transition-all shadow-lg"
                >
                    {n}
                </button>
            ))}

            {/* Done/Check Button (Vertical Pill spanning 3 rows) */}
            <button
                onClick={onDone}
                className="col-start-4 row-start-2 row-span-3 bg-primary text-black flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(0,230,118,0.2)] hover:scale-[1.02] active:scale-95 transition-all border border-white/10"
            >
                <Check size={40} strokeWidth={4} />
            </button>

            {/* Numbers 1, 2, 3 */}
            {['1', '2', '3'].map(n => (
                <button
                    key={n}
                    onClick={() => handlePress(n)}
                    className="aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white text-3xl font-black font-mono active:scale-90 transition-all shadow-lg"
                >
                    {n}
                </button>
            ))}

            {/* Bottom Row: 0 and . */}
            <button
                onClick={() => handlePress('0')}
                className="col-span-2 aspect-[2.1/1] flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white text-3xl font-black font-mono active:scale-90 transition-all shadow-lg"
            >
                0
            </button>
            <button
                onClick={() => handlePress('.')}
                className="aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white text-3xl font-black font-mono active:scale-90 transition-all shadow-lg"
            >
                .
            </button>
        </div>
    );
};
