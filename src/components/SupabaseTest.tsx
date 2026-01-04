import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Course {
    id: number;
    title: string;
    description: string;
    price_usdt: number;
    is_published: boolean;
}

const SupabaseTest = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCourses() {
            try {
                console.log('Testing Supabase connection...');
                const { data, error } = await supabase
                    .from('modules')
                    .select('*');

                if (error) {
                    throw error;
                }

                setCourses(data || []);
            } catch (err: any) {
                console.error('Supabase Error:', err);
                setError(err.message || 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    return (
        <div className="p-8 my-8 bg-gray-900 border border-purple-500/30 rounded-xl max-w-4xl mx-auto shadow-2xl relative z-50">
            <h2 className="text-2xl font-bold text-white mb-4">🔮 Supabase Connection Test</h2>

            {loading && <p className="text-blue-400 animate-pulse">Connecting to database...</p>}

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-200 p-4 rounded">
                    <h3 className="font-bold">Connection Result:</h3>
                    <p>Status: <span className="text-red-400">Error (but connected!)</span></p>
                    <p className="text-sm mt-2 opacity-80">Message: {error}</p>
                    <p className="text-xs mt-2 text-gray-400">
                        * If the error says "relation public.courses does not exist", it means
                        <strong> SUCCESS!</strong> You connected to Supabase, but the table 'courses' hasn't been created yet.
                    </p>
                </div>
            )}

            {!loading && !error && (
                <div className="space-y-4">
                    <p className="text-green-400 font-bold">✓ Connected Successfully!</p>
                    {courses.length === 0 ? (
                        <p className="text-gray-400">Connected, but no courses found (Table is empty).</p>
                    ) : (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                            {courses.map((course) => (
                                <div key={course.id} className="border border-gray-700 p-4 rounded bg-gray-800">
                                    <h3 className="font-bold text-white">{course.title}</h3>
                                    <p className="text-gray-400 text-sm">{course.description}</p>
                                    <p className="text-purple-400 mt-2 font-mono">{course.price_usdt} USDT</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SupabaseTest;
