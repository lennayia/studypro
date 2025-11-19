import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material';
import { User, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';

export const ProfileSettings = () => {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Prosím nahraj obrázek (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Obrázek je příliš velký. Maximální velikost je 2MB.');
      return;
    }

    setUploadingAvatar(true);
    setError(null);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: avatarUrl });

      setFormData({ ...formData, avatar_url: avatarUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError(err.message || 'Chyba při nahrávání avatara');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateProfile({
        full_name: formData.full_name,
        bio: formData.bio,
      });

      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Chyba při ukládání profilu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || '',
    });
    setEditing(false);
    setError(null);
  };

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <User size={24} color="#6366f1" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Profil
            </Typography>
          </Box>
          {!editing && (
            <Button variant="outlined" onClick={() => setEditing(true)}>
              Upravit profil
            </Button>
          )}
        </Stack>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profil byl úspěšně aktualizován!
          </Alert>
        )}

        {uploadingAvatar && <LinearProgress sx={{ mb: 2 }} />}

        {/* Avatar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={formData.avatar_url}
              sx={{
                width: 120,
                height: 120,
                fontSize: 48,
                bgcolor: 'primary.main',
              }}
            >
              {formData.full_name?.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
              component="label"
              disabled={uploadingAvatar}
            >
              <Camera size={20} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Profile Fields */}
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Celé jméno"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            disabled={!editing || loading}
          />

          <TextField
            fullWidth
            label="Email"
            value={profile?.email}
            disabled
            helperText="Email nelze změnit"
          />

          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            disabled={!editing || loading}
            placeholder="Napiš něco o sobě..."
          />

          {/* Stats (read-only) */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Statistiky
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Celkem bodů
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {profile?.total_points || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Aktuální streak
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  {profile?.current_streak || 0} dní 🔥
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Nejdelší streak
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {profile?.longest_streak || 0} dní
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Action Buttons */}
          {editing && (
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<X size={18} />}
                onClick={handleCancel}
                disabled={loading}
              >
                Zrušit
              </Button>
              <Button
                variant="contained"
                startIcon={<Save size={18} />}
                onClick={handleSave}
                disabled={loading || !formData.full_name.trim()}
              >
                {loading ? 'Ukládám...' : 'Uložit změny'}
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
