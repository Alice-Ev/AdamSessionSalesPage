import { useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import validateSchema from "../../validation/cardValidation";
import TextInputComponent from "../../components/TextInputComponent";
import PageHeader from "../../components/PageHeader";
import ROUTES from "../../routes/ROUTES";
import { toServerCreate } from "./normalizeCreateCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const categories = [
  "cat-food",
  "dog-food",
  "fish-food",
  "small-pet-food",
  "bird-food",
  "cat-toy",
  "dog-toy",
  "small-pet-toy",
];

const CreateCard = () => {
  const [inputsValue, setInputValue] = useState({
    title: "",
    subtitle: "",
    category: "",
    price: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    image: "",
    alt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    image: "",
    alt: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
  });

  const navigate = useNavigate();

  let keysArray = Object.keys(inputsValue);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.replace(/^\$?/, "$");
    const isNumber = !isNaN(parseFloat(inputValue)) && isFinite(inputValue);
    const newValue = isNumber ? inputValue : e.target.value;
    setInputValue((currentState) => ({
      ...currentState,
      [e.target.id]: newValue,
    }));
  };
  const handleCategoryChange = (event) => {
    setInputValue((prevState) => ({
      ...prevState,
      category: event.target.value,
    }));
  };

  const handleInputsBlur = (e) => {
    const { error } = validateSchema[e.target.id]({
      [e.target.id]: inputsValue[e.target.id],
    });
    console.log({ error });
    if (error) {
      setErrors((cErrors) => ({
        ...cErrors,
        [e.target.id]: error.details[0].message,
      }));
    } else {
      setErrors((cErrors) => {
        delete cErrors[e.target.id];
        return { ...cErrors };
      });
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/cards", toServerCreate(inputsValue));
      toast.success("🦄 Your Card Created Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate(ROUTES.MYCARDS);
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <PageHeader
        title="Cards"
        subtitle="On this page you can create your cards"
      />
      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {keysArray.map((keyName) => (
            <TextInputComponent
              key={"inputs" + keyName}
              id={keyName}
              label={keyName}
              value={inputsValue[keyName]}
              onChange={handleInputChange}
              onBlur={handleInputsBlur}
              errors={errors[keyName]}
            />
          ))}
          <Grid item xs={12}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={inputsValue.category}
              onChange={handleCategoryChange}
              onBlur={handleInputsBlur}
              className="form-control"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-danger">{errors.category}</p>
            )}
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs>
          <Link to={ROUTES.HOME}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => handleCreateCard(e)}
              disabled={Object.keys(errors).length > 0}
            >
              Create
            </Button>
          </Link>
        </Grid>
        <Grid item xs>
          <Link to={ROUTES.HOME}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Discard
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};
export default CreateCard;
