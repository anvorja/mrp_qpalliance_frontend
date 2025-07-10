// src/app/settings/page.tsx
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Moon, Sun, Bell, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("es");

  const handleSaveSettings = () => {
    toast.success("Configuración guardada", {
      description: "Tus preferencias han sido actualizadas correctamente."
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>
            Personaliza tu experiencia en la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Apariencia</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              <TabsTrigger value="account">Cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="pt-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="language" className="text-base">Idioma</Label>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecciona un idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Portugués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="api-key" className="text-base">Clave API</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Input id="api-key" defaultValue="sk_test_****************************" readOnly className="flex-1" />
                    <Button variant="outline">Mostrar</Button>
                    <Button variant="outline">Copiar</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Usa esta clave para acceder a las APIs del sistema en modo de prueba
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="pt-4 space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="dark-mode" className="text-base">Modo Oscuro</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="high-contrast" className="text-base">Alto Contraste</Label>
                </div>
                <Switch id="high-contrast" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size" className="text-base">Tamaño de Fuente</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="font-size" className="w-full">
                    <SelectValue placeholder="Selecciona un tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeño</SelectItem>
                    <SelectItem value="medium">Mediano</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="pt-4 space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="notifications" className="text-base">Habilitar Notificaciones</Label>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Tipos de Notificaciones</Label>
                <div className="grid gap-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="email-notifications" defaultChecked />
                    <Label htmlFor="email-notifications">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="push-notifications" defaultChecked />
                    <Label htmlFor="push-notifications">Push</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sms-notifications" />
                    <Label htmlFor="sms-notifications">SMS</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="username" className="text-base">Nombre de Usuario</Label>
                </div>
                <Input id="username" defaultValue="anborja" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Correo Electrónico</Label>
                <Input id="email" type="email" defaultValue="borjauser@rappi.co" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Contraseña</Label>
                <Input id="password" type="password" defaultValue="********" readOnly />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                  Eliminar Cuenta
                </Button>
                <Button>Cambiar Contraseña</Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSaveSettings}>Guardar Cambios</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}