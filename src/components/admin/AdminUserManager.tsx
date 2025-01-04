import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AdminUser {
  user_id: string;
  email?: string;
  created_at: string;
}

export function AdminUserManager() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const { data: adminUsersData, error } = await supabase
        .from('admin_users')
        .select(`
          *,
          profiles!inner(email)
        `);

      if (error) {
        console.error('Error fetching admin users:', error);
        return;
      }

      setAdminUsers(adminUsersData.map(user => ({
        user_id: user.user_id,
        email: user.profiles?.email,
        created_at: user.created_at
      })));
    } catch (error) {
      console.error('Error in fetchAdminUsers:', error);
    }
  };

  const handleAddAdmin = async () => {
    try {
      // First, get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newAdminEmail)
        .single();

      if (userError || !userData) {
        throw new Error('Utente non trovato');
      }

      // Then add them as an admin
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({ user_id: userData.id });

      if (adminError) throw adminError;

      toast({
        title: "Successo",
        description: "Amministratore aggiunto con successo",
      });

      setNewAdminEmail('');
      fetchAdminUsers();

    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta dell'amministratore",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestione Amministratori</CardTitle>
        <CardDescription>
          Aggiungi o rimuovi amministratori del sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Input
            placeholder="Email del nuovo amministratore"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
          <Button onClick={handleAddAdmin}>
            Aggiungi Admin
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Data Aggiunta</TableHead>
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.map((admin) => (
              <TableRow key={admin.user_id}>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {new Date(admin.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      const { error } = await supabase
                        .from('admin_users')
                        .delete()
                        .eq('user_id', admin.user_id);
                      
                      if (error) {
                        toast({
                          title: "Errore",
                          description: "Impossibile rimuovere l'amministratore",
                          variant: "destructive",
                        });
                        return;
                      }

                      fetchAdminUsers();
                      toast({
                        title: "Successo",
                        description: "Amministratore rimosso con successo",
                      });
                    }}
                  >
                    Rimuovi
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}