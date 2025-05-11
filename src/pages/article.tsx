import { useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { useDebounce } from "../hooks/useDebounce";
import { FormSchemaArticle } from "../validation/articleValidation";
import { useUser } from "@clerk/clerk-react";
import useUsers from "../hooks/useUsers";
import useArticles from "../hooks/useArticles";
import { ArticleType } from "../types/article";
import useArticleCategory from "../hooks/useArticleCategory";

const columns: GridColDef[] = [
  { field: "title", headerName: "Titre", width: 400 },
  { field: "description", headerName: "Description", width: 600 },
  {
    field: "category",
    headerName: "Categorie",
    width: 250,
    valueGetter: (value: { name: string }) => `${value.name}`,
  },
  { field: "readingTime", headerName: "Temps de lecture (min)", width: 200 },
];

const Index = () => {
  const { fetchUserActive } = useUsers();
  const { user } = useUser();

  const {
    fetchArticles,
    articles,
    loading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
    fetchArticle,
  } = useArticles();
  const { fetchArticleCategories, articleCategories } = useArticleCategory();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);
  const [count, setCount] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [articlesFiltered, setArticlesFiltered] = useState<ArticleType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const articleFormConfig: FieldConfig[] = [
    {
      name: "title",
      label: "Titre",
      type: "text",
      validation: { required: "Le titre est requis" },
      showOn: "always",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      validation: { required: "La description est requise" },
      showOn: "always",
    },
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
    {
      name: "banner",
      label: "Bannière",
      type: "banner",
      validation: {},
      showOn: "always",
    },
    {
      name: "content",
      label: "Contenu",
      type: "textArea",
      validation: {},
      showOn: "always",
    },
    {
      name: "readingTime",
      label: "Temps de lecture (min)",
      type: "number",
      validation: {},
      showOn: "always",
    },
  ];

  const debouncedSearch = useDebounce(search, 500);

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
    fetchArticles({ page: page, perPage: perPage });
  }, [perPage, page]);

  useEffect(() => {
    const totalCount = Math.ceil(articles.total / perPage);
    setCount(totalCount);
  }, [perPage, articles]);

  useEffect(() => {
    const filtered = articles.data.filter((c) =>
      `${c.title} ${c.description}`
        .toLowerCase()
        .includes(debouncedSearch.trim().toLowerCase())
    );

    setArticlesFiltered(filtered);
  }, [debouncedSearch, articles]);

  const handleRowDoubleClick = async (rowData: GridRowParams) => {
    await fetchArticle(rowData.id.toString()).then((article) => {
      setFormData({
        ...rowData,
        row: {
          ...article,
          categoryId: article.category.id,
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

  const handleBannerChange = () => {
    setBanner(banner);
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
            title="Liste des articles"
            onAddClick={() => setOpen(true)}
            searchValue={search}
            onSearchChange={setSearch}
          />
          <GridComponent
            rows={articlesFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => {
              handleRowDoubleClick(params);
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <FormControl
              variant="standard"
              sx={{
                m: 1,
                minWidth: 120,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <InputLabel variant="outlined">Ligne par page</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={perPage}
                label="Ligne par page"
                sx={{ width: "100%" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(data: SelectChangeEvent<any>) => {
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
            FormSchema={FormSchemaArticle}
            onClose={() => handleCloseModal()}
            title={formData ? "Modifier une article" : "Créer une article"}
            fields={articleFormConfig}
            onSubmit={(data) => handleSubmitClick(data)}
            initialData={formData}
            TransitionProps={{ onExited: () => setFormData(null) }}
            onDelete={(id) => {
              handleDeleteClick(id);
            }}
            onSubmitBanner={() => handleBannerChange()}
          />
        </Box>
      )}
    </Box>
  );
};
export default Index;
