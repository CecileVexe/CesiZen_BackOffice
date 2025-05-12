import useRoles from "../hooks/useRoles";
import { useEffect } from "react";
import { Box } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { RoleType } from "../types/role";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import { useDebounce } from "../hooks/useDebounce";
import { useUser } from "@clerk/clerk-react";
import useUsers from "../hooks/useUsers";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nom", width: 130 },
];

const Role = () => {
  const { fetchUserActive } = useUsers();
  const { user } = useUser();

  const { fetchRoles, roles, loading, error } = useRoles();

  const [search, setSearch] = useState<string>("");
  const [rolesFiltered, setRolesFiltered] = useState<RoleType[]>([]);

  const debouncedSearch = useDebounce(search, 500);

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
    fetchRoles();
  }, []);

  useEffect(() => {
    const filtered = roles.data.filter((c) =>
      `${c.name}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
    );
    setRolesFiltered(filtered);
  }, [debouncedSearch, roles]);

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
            title="Liste des rôles"
            searchValue={search}
            onSearchChange={setSearch}
          />
          <GridComponent
            rows={rolesFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
          />
        </Box>
      )}
    </Box>
  );
};
export default Role;
