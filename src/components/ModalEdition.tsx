import React, { JSX, useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GridRowParams } from "@mui/x-data-grid";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export interface FieldConfig {
  name:
    | "title"
    | "description"
    | "content"
    | "readingTime"
    | "categoryId"
    | "name"
    | "email"
    | "password"
    | "roleId"
    | "surname"
    | "banner"
    | "color"
    | "smiley"
    | "emotionCategoryId";
  label: string;

  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "file"
    | "banner"
    | "dropdown"
    | "textArea"
    | "date"
    | "checkbox"
    | "textArea"
    | "color";
  defaultValue?: string | number;
  validation?: Record<string, string | object>;
  showOn: "create" | "edit" | "always";
  options?: Array<{
    value: string | number;
    label: string | JSX.Element;
    color?: string;
  }> | null;
  isDisabled?: boolean;
  dataFormat?: (value: unknown) => string;
}

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: any) => void;
  onDelete?: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: GridRowParams<any> | null;
  TransitionProps?: {
    onExited: () => void;
  };
  onSubmitFile?: (file: File) => void;
  onSubmitBanner?: (file: File) => void;
  interfaceActive?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FormSchema: z.ZodType<any, any>;
}

const GenericModal: React.FC<GenericModalProps> = ({
  open,
  onClose,
  title,
  onSubmit,
  fields,
  initialData,
  onDelete,
  TransitionProps,
  onSubmitFile,
  onSubmitBanner,
  FormSchema,
}) => {
  const isEdit = Boolean(initialData);
  const [existingBannerUrl, setExistingBannerUrl] = useState<string | null>(
    null
  );
  const baseUrl = import.meta.env.VITE_BASE_URL;

  type FormSchemaType = z.infer<typeof FormSchema>;
  const {
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields, errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData?.row ? initialData.row : {},
  });

  console.log(errors);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const selectedCategoryId = watch("emotionCategoryId");

    const selectedCategory = fields
      .find((field) => field.name === "emotionCategoryId")
      ?.options?.find((opt) => opt.value === selectedCategoryId);

    if (selectedCategory) {
      const categoryColor = selectedCategory?.color || "#ffffff";
      setValue("color", categoryColor);
    }
  }, [watch("emotionCategoryId")]);

  const fetchBannerUrl = useCallback(async () => {
    if (initialData?.row?.bannerId) {
      try {
        setExistingBannerUrl(`${baseUrl}/image/${initialData?.row?.bannerId}`);
      } catch (err) {
        console.error("Erreur lors de la récupération de la bannière :", err);
      }
    }
  }, [baseUrl, initialData?.row?.bannerId]);

  useEffect(() => {
    fetchBannerUrl();
  }, [fetchBannerUrl]);

  // Show/hide password state
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Reset du formulaire avec initialData
    reset(initialData?.row || {});

    // Initialisation de l'état showPassword à false pour tous les champs password
    const initVisibility: Record<string, boolean> = {};
    fields.forEach((f) => {
      if (f.type === "password") initVisibility[f.name] = false;
    });
    setShowPassword(initVisibility);
  }, [initialData, reset, fields]);

  // Filter fields by mode
  const filteredFields = fields.filter(
    (f) =>
      f.showOn === "always" ||
      (isEdit && f.showOn === "edit") ||
      (!isEdit && f.showOn === "create")
  );

  const handleClickShowPassword = (name: string) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handlePatch = (data: Record<string, unknown>) => {
    const payload: Record<string, unknown> = { id: initialData?.id };
    Object.keys({ ...dirtyFields }).forEach((key) => {
      payload[key] = data[key];
    });
    if (onSubmit) {
      onSubmit(payload);
    }
  };

  const handleCreate = (payload: FormSchemaType) => {
    if (onSubmit) {
      onSubmit(payload);
    }
  };

  useEffect(() => {
    if (!open) {
      setExistingBannerUrl(null);
      setSelectedImage(null);
    }
  }, [open]);

  console.log(selectedImage);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={TransitionProps}
      sx={{ "& .MuiDialog-paper": { width: "90%", maxHeight: "90vh" } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form
          id="generic-form"
          onSubmit={handleSubmit(isEdit ? handlePatch : handleCreate)}
        >
          {filteredFields.map((field) => {
            const isPwd = field.type === "password";
            const type =
              isPwd && showPassword[field.name] ? "text" : field.type;
            return (
              <Controller
                key={field.name}
                name={field.name as string}
                control={control}
                defaultValue={
                  field.type === "dropdown"
                    ? typeof initialData?.row?.[field.name] === "object"
                      ? initialData.row[field.name].id
                      : initialData?.row?.[field.name] ?? ""
                    : field.defaultValue ?? ""
                }
                render={({ field: ctrl, fieldState: { error } }) => {
                  const rawValue = ctrl.value;
                  const displayValue =
                    field.dataFormat && rawValue != null
                      ? field.dataFormat(rawValue)
                      : rawValue;
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        mt: 2,
                      }}
                    >
                      {field.type !== "file" &&
                        field.type !== "banner" &&
                        field.type !== "checkbox" && (
                          <TextField
                            {...ctrl}
                            label={field.label}
                            value={displayValue}
                            select={field.type === "dropdown"}
                            type={type}
                            multiline={field.type === "textArea"}
                            disabled={field.isDisabled}
                            fullWidth
                            variant="outlined"
                            error={!!error}
                            helperText={error?.message}
                            InputProps={
                              isPwd
                                ? {
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={() =>
                                            handleClickShowPassword(field.name)
                                          }
                                          edge="end"
                                        >
                                          {showPassword[field.name] ? (
                                            <VisibilityOff />
                                          ) : (
                                            <Visibility />
                                          )}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }
                                : undefined
                            }
                          >
                            {field.options &&
                              field.options.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                          </TextField>
                        )}

                      {field.type === "banner" && (
                        <>
                          <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                          >
                            {field.label}
                            <VisuallyHiddenInput
                              name={ctrl.name}
                              ref={ctrl.ref}
                              onBlur={ctrl.onBlur}
                              type="file"
                              onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                ctrl.onChange(file);
                                setSelectedImage(file);
                                if (onSubmitBanner && onSubmitFile && file) {
                                  onSubmitBanner(file);
                                  setSelectedImage(file);
                                }
                              }}
                            />
                          </Button>

                          <Box sx={{ mt: 2 }}>
                            {selectedImage ? (
                              <Box sx={{ position: "relative" }}>
                                <img
                                  src={URL.createObjectURL(selectedImage)}
                                  alt="Preview"
                                  style={{ width: 100, height: 100 }}
                                />
                                <IconButton
                                  onClick={() => {
                                    setValue(field.name, null, {
                                      shouldDirty: true,
                                    });
                                    handleRemoveSelectedImage();
                                  }}
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    zIndex: 1,
                                    backgroundColor: "black",
                                    color: "red",
                                    borderRadius: "50%",
                                    "&:hover": {
                                      backgroundColor: "red",
                                      color: "white",
                                    },
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            ) : existingBannerUrl ? (
                              <Box sx={{ position: "relative" }}>
                                <img
                                  src={existingBannerUrl}
                                  alt="Banner existante"
                                  style={{ width: 100, height: 100 }}
                                />
                              </Box>
                            ) : null}
                          </Box>
                        </>
                      )}
                    </Box>
                  );
                }}
              />
            );
          })}
        </form>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: initialData?.id ? "space-between" : "flex-end" }}
      >
        {isEdit && initialData?.id && (
          <Button
            color="warning"
            onClick={() => onDelete?.(initialData.id.toString())}
          >
            Supprimer
          </Button>
        )}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={() => {
              onClose();
            }}
            color="secondary"
          >
            Annuler
          </Button>
          {onSubmit && (
            <Button
              type="submit"
              form="generic-form"
              color="primary"
              variant="contained"
            >
              Valider
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default GenericModal;
