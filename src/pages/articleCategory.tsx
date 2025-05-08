import { useEffect } from "react";
import { Box } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useState } from "react";
import { ArticleCategoryType } from "../types/articleCategory";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import { useDebounce } from "../hooks/useDebounce";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { FormSchema } from "../validation/categoryValidation";

import { useUser } from "@clerk/clerk-react";
import useUsers from "../hooks/useUsers";
import useArticleCategory from "../hooks/useArticleCategory";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Nom", width: 130 },
  { field: "description", headerName: "Description", width: 750 },
];

const Index = () => {
  const { fetchUserActive } = useUsers();
  const { user } = useUser();

  const {
    fetchArticleCategories,
    articleCategories,
    loading,
    error,
    createArticleCategory,
    updateArticleCategory,
    deleteArticleCategory,
  } = useArticleCategory();
  const [search, setSearch] = useState<string>("");
  const [articleCategoriesFiltered, setCategoriesFiltered] = useState<
    ArticleCategoryType[]
  >([]);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const debouncedSearch = useDebounce(search, 500);

  const createArticleCategoryFormConfig: FieldConfig[] = [
    {
      name: "name",
      label: "Nom",
      type: "text",
      defaultValue: "",
      validation: { required: "Le nom est requis" },
      showOn: "always",
    },
    {
      name: "description",
      label: "Description",
      type: "textArea",
      defaultValue: "",
      validation: { required: "Le nom est requis" },
      showOn: "always",
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
    fetchArticleCategories();
  }, []);

  useEffect(() => {
    const filtered = articleCategories.data.filter((c) =>
      `${c.name}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
    );
    setCategoriesFiltered(filtered);
  }, [debouncedSearch, articleCategories]);

  const handleRowDoubleClick = (rowData: GridRowParams) => {
    setFormData(rowData);
    setOpen(true);
  };

  const handleSubmitClick = (data: ArticleCategoryType) => {
    if (data.id) {
      updateArticleCategory(data.id, data);
    } else {
      createArticleCategory(data);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: string) => {
    deleteArticleCategory(id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setOpen(false);
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
            title="Liste des catégories d'articles"
            searchValue={search}
            onAddClick={() => setOpen(true)}
            onSearchChange={setSearch}
          />
          <GridComponent
            rows={articleCategoriesFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => {
              handleRowDoubleClick(params);
            }}
          />
          <ModalEdition
            open={open}
            onClose={() => handleCloseModal()}
            FormSchema={FormSchema}
            title={formData ? "Modifier une catégorie" : "Créer une catégorie"}
            fields={createArticleCategoryFormConfig}
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
