import { useEffect } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { useDebounce } from "../hooks/useDebounce";
import { FormSchema } from "../validation/resourceValidation";
import { useUser } from "@clerk/clerk-react";
import useUsers from "../hooks/useUsers";
import useArticles from "../hooks/useArticles";
import { ArticleType } from "../types/article";
import useArticleCategory from "../hooks/useArticleCategory";


const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Titre", width: 130 },
  { field: "description", headerName: "Description", width: 130 },
  {
    field: "category",
    headerName: "Categorie",
    width: 160,
    valueGetter: (value: { name: string }) => `${value.name}`,
  },
];

const Index = () => {
  const { fetchUserActive } = useUsers();
  const { user } = useUser();


  const { fetchArticles, articles, loading, error, createArticle, updateArticle, deleteArticle, fetchArticle } = useArticles();
  const { fetchArticleCategories, articleCategories } = useArticleCategory();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [count, setCount] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [articlesFiltered, setArticlesFiltered] = useState<ArticleType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const ressourceFormConfig: FieldConfig[] = [
    { name: "title", label: "Titre", type: "text", validation: { required: "Le titre est requis" }, showOn: "always" },
    { name: "description", label: "Description", type: "text", validation: { required: "La description est requise" }, showOn: "always" }, 
    {
      name: "categoryId",
      label: "Catégorie",
      type: "dropdown",
      validation: { required: "La catégorie est requise" },
      showOn: "always",
      options: articleCategories.data.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    },
    { name: "bannerId", label: "Bannière", type: "banner", validation: {}, showOn: "create" },
    { name: "content", label: "Contenu", type: "textArea", validation: {}, showOn: "always" },
  ];

  const debouncedSearch = useDebounce(search, 500);

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
            console.error("Erreur lors de la récupération du citoyen actif :", error);
          }
        }
      };
  
      fetchUserRole();
    }, [user]);

  useEffect(() => {
    fetchArticleCategories();
  }, []);

  useEffect(() => {
    fetchArticles({ page: page, perPage: perPage });
  }, [perPage, page]);

  useEffect(() => { const totalCount = Math.ceil (articles.total / perPage);
    setCount(totalCount);}, [perPage, articles]);

  useEffect(() => {
    const filtered = articles.data.filter((c) => `${c.title} ${c.description}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase()));

    setArticlesFiltered(filtered);
  }, [debouncedSearch, articles]);

  const handleRowDoubleClick = async (rowData: any) => {
    await fetchArticle(rowData.id).then((resource) => {
      setFormData({
        ...rowData,
        row: {
          ...resource,
          categoryId: resource.category.id,
        },
      });
    });
    setOpen(true);
  };

  const handleSubmitClick = (data: ArticleType) => {
    if (data.id) {
      const { ...rest } = data;
      updateArticle(data.id.toString(), {
        ...rest,
      
      });
    } else {
      createArticle({
        ...data,
       
      });
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: string) => {
    deleteArticle(id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleFileChange = (data: File) => {
    setFile(data);
  };

  const handleBannerChange = (data: File) => {
    setBanner(banner);
  };

    console.log(formData)


  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      {error && <ErrorComponent errorMessage={error?.message} />}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <HeaderGrid title="Liste des ressources" onAddClick={() => setOpen(true)} searchValue={search} onSearchChange={setSearch} />
          <GridComponent
            rows= {articlesFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => {
              handleRowDoubleClick(params);
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, display: "flex", flexDirection: "row" }}>
              <InputLabel variant="outlined">Ligne par page</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={perPage}
                label="Ligne par page"
                sx={{ width: "100%" }}
                onChange={(data: any) => {
                  setPerPage(parseInt(data.target.value));
                  setPage(1);
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => {
                  setPage(page - 1);
                }}
                disabled={page === 1}
              >
                -
              </Button>
              <Typography>
                {page} sur {count}
              </Typography>
              <Button
                onClick={() => {
                  setPage(page + 1);
                }}
                disabled={page === count}
              >
                +
              </Button>
            </Box>
          </Box>
          <ModalEdition
            open={open}
            FormSchema={FormSchema}
            onClose={() => handleCloseModal()}
            title={formData ? "Modifier une ressource" : "Créer une ressource"}
            fields={ressourceFormConfig}
            onSubmit={(data) => handleSubmitClick(data)}
            initialData={formData}
            TransitionProps={{ onExited: () => setFormData(null) }}
            onDelete={(id) => {
              handleDeleteClick(id);
            }}
            onSubmitFile={(data) => handleFileChange(data)}
            onSubmitBanner={(data) => handleBannerChange(data)}
            
          />
        </Box>
      )}
    </Box>
  );
};
export default Index;
