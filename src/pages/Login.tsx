
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock } from 'lucide-react';
import ChartLine from '@/components/icons/ChartLine';
import ProtectionOverlay from '@/components/shared/ProtectionOverlay';

const formSchema = z.object({
  email: z.string().email("Некорректный адрес электронной почты"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real application, you would authenticate with a backend
    // For demonstration, we'll just show a success toast and redirect
    toast({
      title: "Вход выполнен",
      description: `Добро пожаловать, ${values.email}`,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <ProtectionOverlay />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-trading-card border-gray-800">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <Link to="/" className="flex items-center space-x-2">
                <ChartLine className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  ProTrader Systems
                </span>
              </Link>
            </div>
            <CardTitle className="text-2xl">Вход в аккаунт</CardTitle>
            <CardDescription className="text-gray-400">
              Введите данные для доступа к образовательным материалам
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Электронная почта</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="email@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Пароль</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            placeholder="••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Войти
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-gray-400 text-center">
              Еще нет аккаунта?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
