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
  is_superadmin?: boolean;
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
      console.log('Fetching admin users...');
      const { data: adminUsersData, error: adminError } = await supabase
        .from('admin_users')
        .select('*');

      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        return;
      }

      const adminUsersWithProfiles = await Promise.all(
        adminUsersData.map(async (admin) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('id', admin.user_id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return {
              user_id: admin.user_id,
              created_at: admin.created_at,
              email: 'Username not found',
              is_superadmin: admin.is_superadmin
            };
          }

          return {
            user_id: admin.user_id,
            created_at: admin.created_at,
            email: profileData?.username || 'Username not found',
            is_superadmin: admin.is_superadmin
          };
        })
      );

      console.log('Admin users with profiles:', adminUsersWithProfiles);
      setAdminUsers(adminUsersWithProfiles);
    } catch (error) {
      console.error('Error in fetchAdminUsers:', error);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newAdminEmail)
        .single();

      if (userError || !userData) {
        throw new Error('Utente non trovato');
      }

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
            placeholder="Username del nuovo amministratore"
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
              <TableHead>Username</TableHead>
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
                  {!admin.is_superadmin ? (
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
                  ) : (
                    <span className="text-sm text-muted-foreground">Super Admin</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}