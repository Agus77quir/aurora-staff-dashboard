
import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart, User, Home, Plus, Users, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserProfileButton from "@/components/auth/UserProfileButton";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = ({ open, toggleSidebar }: SidebarProps) => {
  const { user, signOut } = useAuth();
  
  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out ${
        open ? "w-64" : "w-16"
      } bg-sidebar border-r border-white/10`}
    >
      <div className="flex h-full flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex h-16 items-center justify-between px-4">
            {open && (
              <h2 className="text-xl font-bold text-gradient">
                Aurora RRHH
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className="rounded-md p-1.5 hover:bg-aurora-darkblue"
            >
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </button>
          </div>

          <nav className="mt-5 px-2">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Home className={`h-5 w-5 ${!open && "mx-auto"}`} />
                  {open && <span className="ml-3">Dashboard</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/empleados"
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Users className={`h-5 w-5 ${!open && "mx-auto"}`} />
                  {open && <span className="ml-3">Empleados</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/empleados/nuevo"
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Plus className={`h-5 w-5 ${!open && "mx-auto"}`} />
                  {open && <span className="ml-3">Nuevo Empleado</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/configuracion"
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Settings className={`h-5 w-5 ${!open && "mx-auto"}`} />
                  {open && <span className="ml-3">Configuración</span>}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mb-4 px-2">
          <div className={`rounded-lg ${open ? "p-4" : "p-2"} bg-sidebar-accent`}>
            {open ? (
              user ? (
                <div>
                  <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                    {user.email}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => signOut()}
                    className="mt-2 w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Salir
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.location.href = '/auth'}
                >
                  <User className="h-4 w-4 mr-2" /> Iniciar sesión
                </Button>
              )
            ) : (
              <UserProfileButton />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
