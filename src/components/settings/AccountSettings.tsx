import { useState } from 'react';
import { db } from '@/lib/indexedDB';
import { hashPassword, verifyPassword } from '@/lib/crypto';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';

export function AccountSettings() {
    const { logout } = useAuth();
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        // Validation
        if (!oldPassword || !newPassword) {
            alert('❌ Please fill in old password and new password');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('❌ Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            alert('❌ Password must be at least 8 characters');
            return;
        }

        // Verify old password
        try {
            const storedHash = await db.getSetting<string>('admin_password_hash');
            if (!storedHash) {
                alert('❌ No password set. Please contact administrator.');
                return;
            }

            const valid = await verifyPassword(oldPassword, storedHash);

            if (!valid) {
                alert('❌ Old password is incorrect');
                return;
            }

            setShowConfirm(true);
        } catch (error) {
            console.error('Error validating password:', error);
            alert('❌ Error validating password');
        }
    }

    async function confirmChange() {
        setIsSaving(true);
        try {
            // Hash new password
            const hash = await hashPassword(newPassword);

            // Save new credentials
            if (username.trim()) {
                await db.setSetting('admin_username', username.trim());
            }
            await db.setSetting('admin_password_hash', hash);

            alert('✅ Account updated successfully! You will be logged out.');

            // Force logout after delay
            setTimeout(() => {
                logout();
                window.location.href = '/';
            }, 1500);
        } catch (error) {
            console.error('Error updating account:', error);
            alert('❌ Error updating account');
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <Card className="p-6 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                            Security Notice
                        </p>
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                            Changing your password will log you out immediately. Make sure to remember your new password.
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Account Credentials</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">New Username (optional)</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Leave empty to keep current"
                        />
                        <p className="text-xs text-muted-foreground">
                            If provided, your username will be updated
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="oldPassword">Old Password *</Label>
                        <Input
                            id="oldPassword"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Required for verification"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password *</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                        />
                    </div>
                </div>
            </Card>

            <Button
                onClick={handleSave}
                variant="destructive"
                className="w-full"
                disabled={isSaving}
            >
                {isSaving ? 'Updating...' : 'Update Account & Logout'}
            </Button>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogTitle>Confirm Password Change</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be logged out immediately after changing your password.
                        Make sure you remember your new credentials.
                        <br /><br />
                        Continue with password change?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmChange} disabled={isSaving}>
                            {isSaving ? 'Updating...' : 'Confirm & Logout'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
