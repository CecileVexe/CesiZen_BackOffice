import useComments from "../hooks/useEmotion";
import { useEffect } from "react";
import { Box } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useState } from "react";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { useDebounce } from "../hooks/useDebounce";
import useCitizens from "../hooks/useUsers";
import { useUser } from "@clerk/clerk-react";
import useUsers from "../hooks/useUsers";
import { EmotionType } from "../types/emotion";
import { FormSchema } from "../validation/emotionValidation";
import useEmotionCategory from "../hooks/useEmotionCategory";
import Icon from "@mdi/react";
import { emoticonOptions } from "../utils/emotionsEmoticons";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Nom", width: 200 },
  { field: "color", headerName: "Couleur", width: 200 },
  {
    field: "emotionCategory",
    headerName: "Emotion Principale",
    width: 200,
    valueGetter: (value: { name: string }) => `${value.name}`,
  },
];

const Comment = () => {
  const { user } = useUser();
  const { fetchUserActive } = useUsers();
  const { fetchEmotionCategories, emotionCategories } = useEmotionCategory();

  const {
    fetchEmotions,
    emotions,
    loading,
    error,
    deleteEmotion,
    createEmotion,
    updateEmotion,
  } = useComments();
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [search, setSearch] = useState<string>("");
  const [emotionsFiltered, setCommentsFiltered] = useState<EmotionType[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  const createCommentFormConfig: FieldConfig[] = [
    {
      name: "name",
      label: "Nom",
      type: "text",
      showOn: "always",
    },
    {
      name: "emotionCategoryId",
      label: "Emotion Principale",
      type: "dropdown",
      validation: { required: "L'émotion principale est requise" },
      showOn: "always",
      options: emotionCategories.data.map((cat) => ({
        value: cat.id,
        label: cat.name,
        color: cat.color
      })),
    },
    {
      name: "color",
      label: "Couleur",
      type: "color",
      showOn: "always",
      isDisabled: true,
    },
    
  ];

  // Récupération du rôle utilisateur et log si USER
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        try {
          const citizen = await fetchUserActive(user.id);
          if (citizen?.role?.name === "USER") {
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
    fetchEmotions();
  }, []);

  useEffect(() => {
    const filtered = emotions.data.filter((c) =>
      `${c.name} `
        .toLowerCase()
        .includes(debouncedSearch.trim().toLowerCase())
    );
    setCommentsFiltered(filtered);
  }, [debouncedSearch, emotions]);

  const handleRowDoubleClick = (rowData: any) => {
    setFormData(rowData);
    setOpen(true);
  };

 const handleSubmitClick = (data: EmotionType) => {
  console.log("ICI", data)
     if (data.id) {
       const { ...rest } = data;
       updateEmotion(data.id.toString(), {
         ...rest,
       
       });
     } else {
       createEmotion({
         ...data,
        
       });
     }
     handleCloseModal();
   };

  const handleDeleteClick = (id: string) => {
    deleteEmotion(id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setFormData(null);
    setOpen(false);
  };

  console.log(formData)

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
            title="Liste des commentaires"
            searchValue={search}
            onSearchChange={setSearch}
            onAddClick={() => setOpen(true)}
          />
          <GridComponent
            rows={emotionsFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => {
              handleRowDoubleClick(params);
            }}
          />

          <ModalEdition
            open={open}
            FormSchema={FormSchema}
            onClose={() => handleCloseModal()}
            title={"Modifier l'émotion"}
            fields={createCommentFormConfig}
            initialData={formData}
            onSubmit={(data) => handleSubmitClick(data)}
            onDelete={(id) => {
              handleDeleteClick(id);
            }}
          />
        </Box>
      )}
    </Box>
  );
};
export default Comment;
