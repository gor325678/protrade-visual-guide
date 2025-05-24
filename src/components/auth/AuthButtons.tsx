
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AuthButtons = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full p-0 h-10 w-10">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback className="bg-primary">
                  {user.name?.substring(0, 2).toUpperCase() || <User size={16} />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuItem
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="text-red-500 focus:text-red-500 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex items-center space-x-3">
      <Button variant="outline" size="sm" onClick={() => loginWithRedirect()} className="flex items-center space-x-1">
        <LogIn className="h-4 w-4" />
        <span>Войти</span>
      </Button>
      <Button 
        size="sm" 
        onClick={() => loginWithRedirect({
          authorizationParams: {
            screen_hint: 'signup'
          }
        })} 
        className="flex items-center space-x-1"
      >
        <UserPlus className="h-4 w-4" />
        <span>Регистрация</span>
      </Button>
    </div>
  );
};

export default AuthButtons;
