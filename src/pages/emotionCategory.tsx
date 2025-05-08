import { useEffect } from "react";
import { Box } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useState } from "react";
import { EmotionCategory } from "../types/emotionCateogory";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import { useDebounce } from "../hooks/useDebounce";
import { useUser } from "@clerk/clerk-react";
import useUsers from "../hooks/useUsers";
import useEmotionCategory from "../hooks/useEmotionCategory";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { FormSchema } from "../validation/emotionCategoryValidation";
import Icon from "@mdi/react";
import { emoticonOptions } from "../utils/emotionsEmoticons";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nom", width: 130 },
  { field: "color", headerName: "Couleur", width: 130 },
  { field: "smiley", headerName: "Icone", width: 130 },
];

const Index = () => {
  const { fetchUserActive } = useUsers();
  const { user } = useUser();

  const {
    fetchEmotionCategories,
    emotionCategories,
    createEmotionCategory,
    updateEmotionCategory,
    deleteEmotionCategory,
    loading,
    error,
  } = useEmotionCategory();
  const [search, setSearch] = useState<string>("");
  const [emotionCategoriesFiltered, setEmotionCategoriesFiltered] = useState<
    EmotionCategory[]
  >([]);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const debouncedSearch = useDebounce(search, 500);

  const createEmotionCategoryFormConfig: FieldConfig[] = [
    {
      name: "name",
      label: "Nom",
      type: "text",
      defaultValue: "",
      validation: { required: "Le nom est requis" },
      showOn: "always",
    },
    {
      name: "color",
      label: "Couleur",
      type: "color",
      defaultValue: "",
      validation: { required: "Le couleur est requis" },
      showOn: "always",
    },

    {
      name: "smiley",
      label: "Icône",
      type: "dropdown",
      defaultValue: "",
      validation: { required: "L'icône est requise" },
      showOn: "always",
      options: emoticonOptions.map((option) => ({
        label: (
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon path={option.icon} size={1} /> {option.label}
          </span>
        ),
        value: option.value,
      })),
    },
  ];

  // Récupération du rôle utilisateur et log si USER
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        try {
          const fetchedUser = await fetchUserActive(user.id);
          if (fetchedUser?.role?.name === "USER") {
            console.log("Rôle détecté : USER");
            window.location.href = "/401";
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération du citoyen actif :",
            error
          );
        }
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    fetchEmotionCategories();
  }, []);

  useEffect(() => {
    const filtered = emotionCategories.data.filter((c) =>
      `${c.name}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
    );
    setEmotionCategoriesFiltered(filtered);
  }, [debouncedSearch, emotionCategories]);

  const handleRowDoubleClick = (rowData: GridRowParams) => {
    setFormData(rowData);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    deleteEmotionCategory(id);
    handleCloseModal();
  };

  const handleSubmitClick = (data: EmotionCategory) => {
    if (data.id) {
      updateEmotionCategory(data.id, data);
    } else {
      createEmotionCategory(data);
    }
    handleCloseModal();
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {error && <ErrorComponent errorMessage={error?.message} />}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <HeaderGrid
            title="Liste des émotions principales"
            searchValue={search}
            onSearchChange={setSearch}
            onAddClick={() => setOpen(true)}
          />
          <GridComponent
            rows={emotionCategoriesFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => handleRowDoubleClick(params)}
          />
          <ModalEdition
            open={open}
            onClose={() => handleCloseModal()}
            FormSchema={FormSchema}
            title={formData ? "Modifier une catégorie" : "Créer une catégorie"}
            fields={createEmotionCategoryFormConfig}
            onSubmit={(data) => handleSubmitClick(data)}
            initialData={formData}
            TransitionProps={{ onExited: () => setFormData(null) }}
            onDelete={(id) => {
              handleDeleteClick(id);
            }}
          />
        </Box>
      )}
    </Box>
  );
};
export default Index;
