"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Decoration() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Decoration
        </h2>
        <Button>Add Decoration Item</Button>
      </div>
      
      <Tabs defaultValue="theme">
        <TabsList>
          <TabsTrigger value="theme">Theme &amp; Style</TabsTrigger>
          <TabsTrigger value="floral">Floral Arrangements</TabsTrigger>
          <TabsTrigger value="lighting">Lighting &amp; Ambiance</TabsTrigger>
        </TabsList>
        <TabsContent value="theme" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-500 dark:text-slate-400">
                Theme and style content would appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="floral" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-500 dark:text-slate-400">
                Floral arrangement content would appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lighting" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-500 dark:text-slate-400">
                Lighting and ambiance content would appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}