import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import usePlacesAutocomplete, {
	getGeocode,
	getLatLng,
} from "use-places-autocomplete";

interface IProps {
    handleSelection:(value:any)=>void
}

export const PlacesAutoComplete: React.FC<IProps> = ({handleSelection}) => {
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {},
		debounce: 300,
	});

	const handleInput = (e: any) => {
		setValue(e.target.value);
	};

	const handleSelect = ( description:any ) =>{
			setValue(description, false);
			clearSuggestions();
			getGeocode({ address: description }).then((results) => {
				const { lat, lng } = getLatLng(results[0]);
                handleSelection({lat:lat,lng:lng})
      
			})
      //Modern problems require modern solutions ¯\_(ツ)_/¯
      .catch(err=> {

      });
		};

	return (
		<div style={{ marginBottom: "10px" }}>
			<Autocomplete
				disablePortal
				id="combo-box-demo"
				options={data.map((item) => {
					return item.description;
				})}
        onChange={(_ ,data)=>handleSelect(data)}
				sx={{ width: 300 }}
				renderInput={(params) => (
					<TextField
						{...params}
						onChange={handleInput}
						label="Search starting location"
					/>
				)}
			/>
		</div>
	);
};
