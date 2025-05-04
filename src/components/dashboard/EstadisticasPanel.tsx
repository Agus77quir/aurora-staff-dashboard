
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Users, BarChart, Calendar, Database } from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend
} from "recharts";

// Datos de ejemplo para las estadísticas
const estadisticasGeneral = [
  { id: 1, titulo: "Total Empleados", valor: 142, icono: <Users />, cambio: "+12% vs mes anterior" },
  { id: 2, titulo: "Nuevas Contrataciones", valor: 8, icono: <Calendar />, cambio: "+3 vs mes anterior" },
  { id: 3, titulo: "Departamentos", valor: 6, icono: <Database />, cambio: "Sin cambios" },
  { id: 4, titulo: "Salario Promedio", valor: "€45,800", icono: <BarChart />, cambio: "+2.5% vs mes anterior" },
];

// Datos de ejemplo para la distribución por departamento
const datosDepartamentos = [
  { name: "Tecnología", value: 35 },
  { name: "Ventas", value: 25 },
  { name: "Diseño", value: 18 },
  { name: "Marketing", value: 15 },
  { name: "RRHH", value: 12 },
  { name: "Administración", value: 10 },
];

// Datos de contrataciones por mes
const datosContrataciones = [
  { mes: "Ene", contrataciones: 5 },
  { mes: "Feb", contrataciones: 3 },
  { mes: "Mar", contrataciones: 4 },
  { mes: "Abr", contrataciones: 2 },
  { mes: "May", contrataciones: 6 },
  { mes: "Jun", contrataciones: 4 },
  { mes: "Jul", contrataciones: 8 },
  { mes: "Ago", contrataciones: 3 },
  { mes: "Sep", contrataciones: 5 },
  { mes: "Oct", contrataciones: 7 },
  { mes: "Nov", contrataciones: 4 },
  { mes: "Dic", contrataciones: 6 },
];

const COLORS = ["#9b87f5", "#33C3F0", "#1A1F2C", "#7E69AB", "#6E59A5", "#D6BCFA"];

const EstadisticasPanel = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {estadisticasGeneral.map((estadistica) => (
          <Card key={estadistica.id} className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {estadistica.titulo}
              </CardTitle>
              <div className="text-accent h-4 w-4">{estadistica.icono}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadistica.valor}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {estadistica.cambio}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Distribución por Departamento</CardTitle>
            <CardDescription>
              Distribución actual de empleados por área.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosDepartamentos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosDepartamentos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} empleados`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Contrataciones por Mes</CardTitle>
            <CardDescription>
              Número de nuevos empleados por mes en el último año.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart
                data={datosContrataciones}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="mes" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(155, 135, 245, 0.1)" }}
                  formatter={(value) => [`${value} contrataciones`, "Contrataciones"]}
                />
                <Bar dataKey="contrataciones" radius={[4, 4, 0, 0]} fill="#9b87f5" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstadisticasPanel;
