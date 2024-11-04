import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/app';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useAiTeamsApi from "@/hooks/useAiTeams";
import useUsers from "@/hooks/useUsers";
import {
  FormLayout,
  FormHeader,
  FormContent,
  FormInputGroup,
  FormTextField,
} from "@/utils/FormsViewUtils";
import { PageProps } from '@/types/Page';
import { SelectChangeEvent } from '@mui/material';
import { AiTeamsFormState } from '@/types/AiTeams';
import { Select, MenuItem } from '@mui/material';

const AiTeamsForm: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const { aiTeamId, aiTeamName } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getAiTeamDetails, createAiTeam, updateAiTeam } = useAiTeamsApi();
  const { getNoSuperAdminUsers } = useUsers();
  const t = languages[language];

  const [formState, setFormState] = useState<AiTeamsFormState>({
    isLoading: true,
    isError: false,
    isSubmitting: false,
    isEditing: false,
    searchQuery: '',
    contentPerPage: '10',
    isSearching: false,
    users: [],
    formData: {
      id: '',
      name: aiTeamName || '',
      description: '',
      address: '',
      owner_data: {
        name: `${auth?.first_name || ''} ${auth?.last_name || ''}`.trim(),
        email: auth?.email || '',
        id: auth?.uuid || ''
      }
    }
  });

  useEffect(() => {
    const currentPath = aiTeamId
      ? `/builder/form/${aiTeamName}/${aiTeamId}`
      : "/builder/form";

    replacePath([
      {
        label: aiTeamId ? formState.formData.name || aiTeamName || '' : t.leftMenu.aiTeams,
        current_path: "/builder",
        preview_path: "/builder",
        translationKey: "aiTeams"
      },
      {
        label: aiTeamId ? t.aiTeamsForm.editTitle : t.aiTeamsForm.createTitle,
        current_path: currentPath,
        preview_path: "",
        translationKey: aiTeamId ? "editTeam" : "createTeam"
      }
    ]);
  }, [aiTeamId, aiTeamName, formState.formData.name, t]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!auth?.uuid) {
        navigate('/auth/login');
        return;
      }

      try {
        const nonSuperUsers = await getNoSuperAdminUsers();
        if (aiTeamId) {
          const teamDetails = await getAiTeamDetails(aiTeamId);
          if (teamDetails.data) {
            setFormState(prev => ({
              ...prev,
              formData: teamDetails.data
            }));
          }
        }
        if (nonSuperUsers.data) {
          setFormState(prev => ({
            ...prev,
            users: nonSuperUsers.data
          }));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setFormState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    loadInitialData();

  }, [aiTeamId, auth?.uuid]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.formData.name.trim()) {
      ErrorToast(t.actionAllower.fieldRequired);
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isSubmitting: true }));

      const response = aiTeamId
        ? await updateAiTeam(formState.formData, aiTeamId)
        : await createAiTeam(formState.formData);

      if (response?.data) {
        SuccessToast(aiTeamId ? t.aiTeamsForm.successUpdate : t.aiTeamsForm.successCreate);
        navigate('/builder');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      ErrorToast(t.actionAllower.fieldRequired);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  };

  if (formState.isError) return null;

  return (
    <FormLayout>
      <FormHeader
        title={aiTeamId
          ? t.aiTeamsForm.editTitle.replace('{teamName}', formState.formData.name || aiTeamName || '')
          : t.aiTeamsForm.createTitle}
      />

      <FormContent
        onSubmit={handleSubmit}
        isLoading={formState.isLoading}
      >
        {!formState.isLoading && !formState.isError && (
          <>
            <FormInputGroup>
              <FormTextField
                name="name"
                label={t.aiTeamsForm.teamName}
                value={formState.formData.name}
                onChange={handleInputChange}
                required
              />
            </FormInputGroup>

            <FormInputGroup>
              <FormTextField
                name="description"
                label={t.aiTeamsForm.description}
                value={formState.formData.description || ""}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </FormInputGroup>

            <FormInputGroup>
              <FormTextField
                name="address"
                label={t.aiTeamsForm.address}
                value={formState.formData?.address || ''}
                onChange={handleInputChange}
              />
            </FormInputGroup>

            <FormInputGroup>
              <Select
                name="selectedUser"
                label={t.aiTeamsForm.selectUser}
                value={formState.formData.owner_data?.email || ''}
                onChange={handleInputChange}
                fullWidth
                labelId="user-select-label"
              >
                {formState.users.map(user => (
                  <MenuItem key={user.id} value={user.email}>
                    {auth?.email}
                  </MenuItem>
                ))}
              </Select>
            </FormInputGroup>
          </>
        )}
      </FormContent>
    </FormLayout>
  );
};

export default AiTeamsForm;
