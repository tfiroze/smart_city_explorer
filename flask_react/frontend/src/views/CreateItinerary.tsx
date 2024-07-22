import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Paper,
  Typography,
  Divider,
  styled,
  Fab,
  Tooltip,
} from "@mui/material";
import VenueSelection from "../components/createItinerary/VenueSelection";
import { Questionnaire } from "../components/createItinerary/Questionnaire";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IVenueItem from "../models/IVenueItem";
import { ConfirmItineraryItems } from "../components/createItinerary/ConfirmItineraryItems";
import IItinerary from "../models/IItinerary";
import { PickRecommendation } from "../components/createItinerary/PickRecommendation";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { VenueSelectionControls } from "../components/createItinerary/VenueSelectionControls";
import { Header } from "../components/dashboard/Header";
import { smartApi } from "../utils/apiCalls";
import { Loader } from "../components/common/loader";
import { ErrorPage } from "./ErrorPage";
import dayjs, { Dayjs } from "dayjs";

const steps = [
  "Trip Information",
  "Select Recommendations",
  "Itinerary Overview",
  "Itinerary Confirmation",
];

const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

interface IProps {
  // handleCreateItinerary: () => void;
  // addItem: (item: IItinerary) => void;
}

export const CreateItinerary: React.FC<IProps> = ({
  // handleCreateItinerary,
  // addItem,
}) => {

  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [selectedSubCategoryTags, setSelectedSubCategoryTags] = useState<string[]>([]);

  const [zoneGroupItems, setZoneGroupItems] = useState<any>([]);
  const [zoneGroup, setZoneGroup] = useState<string[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(true)

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [dateString, setDateString] = useState<string>(dayjs().add(1, 'day').format('YYYY-MM-DD'))

  const [selectedZoneItemToHiglight, setSelectedZoneItemToHiglight] = useState<string>("");




  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [venueItems, setVenueItems] = useState<IVenueItem[]>([]);

  const [attractionTypeValue, setAttractionTypeValue] = useState<any[]>([]);
  const [attractionTypeName, setAttractionTypeName] = useState<string[]>([])

  const [restaurantTypeValue, setRestaurantTypeValue] = useState<any[]>([]);
  const [restaurantTypeName, setRestaurantTypeName] = useState<string[]>([]);
  const [tripDate, setTripDate] = useState<string>("")

  const [finalvenueids, setFinalVenueids] = useState<string[]>([])
  const [finalVenues, setFinalVenues] = useState([])

  const [fareArr, setFareArr] = useState<string[]>([])
  const [durationArr, setDurationArr] = useState<string[]>([])

  const [loader, setLoader] = useState<boolean>(false)
  const [error, setError] = useState<string>("0")

  useEffect(() => {
    const token = getCookieValue("token");
    token && questionnaire(token); 
  }, [])

  function getCookieValue(cookieName: string) {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return null; // Cookie not found
  }

  const questionnaire = useCallback((token:string)=>{
    setLoader(true)
    smartApi
      .getQuestionnaire(token)
      .then((results) => {
        setLoader(false)
        if (results?.valid && results?.attraction_type && results?.cusine_type) {
          console.log(results)
          setTags([...results.attraction_type]);
          setZoneGroup([...results.zone_group]);
          setSubCategory([...results?.cusine_type])
        } else {
          // ... handle the case when results?.valid is falsy ...
          setError(results.errorType)
        }
      })
      .catch((error) => {
        setError('2')
        setLoader(false)
      });
  },[])


    const updateItinerary = (request: object) => {
      handleGetRecommendation(request)
    };

    const handleGetRecommendation = (request: any) => {
      setLoader(true)
      setTripDate(request.date)
      smartApi.getRecommendation(request)
        .then((results) => {
          setLoader(false)

          if (results?.valid) {
            manipulateRecommendationData(results.attractions, results.attraction_order)
            manipulateRestRecommendationData(results.restaurants, results.restaurant_order)
            setCurrentStep(currentStep + 1);
          } else {
            // ... handle the case when results?.valid is falsy ...
            setError(results.errorType)
          }
        })
        .catch((error) => {
          setError('2')
          setLoader(false)
        });
    }

    const handleGetFare = (request: string[], reqObj: any) => {
      setFinalVenueids(request)
      setFinalVenues(reqObj)
      setLoader(true)
      let req = {
        venue_id: [...request],
        date: tripDate
      }

      smartApi.getFare(req)
        .then((results) => {
          setLoader(false)
          if (results?.valid && results?.data) {
            setFareArr(results.data)
            handleGetDistance(request)
            // setCurrentStep(currentStep + 1);
          } else {
            // ... handle the case when results?.valid is falsy ...

            setError(results.errorType)

          }
        })
        .catch((error) => {
          setError('2')
          setLoader(false)
          // setLoading(false)
        });
    }

    const handleGetDistance = (request: string[]) => {
      let req = {
        venue_id: [...request],
        date: tripDate
      }

      smartApi.getDuration(req)
        .then((results) => {
          setLoader(false)
          if (results?.valid && results?.data) {
            setDurationArr(results.data)
            setCurrentStep(currentStep + 1);
          } else {
            // ... handle the case when results?.valid is falsy ...
            setError(results.errorType)
          }
        })
        .catch((error) => {
          setError('2')
          setLoader(false)
          // setLoading(false)
        });
    }

    const manipulateRecommendationData = (data: any, order: any) => {
      order.sort((a: any, b: any) => a.order - b.order);

      // Extract only the 'type' property
      const typesArray = order.map((item: any) => item.type);

      const dataManipulation: any[] = []
      typesArray.map((element: any, index: number) => {
        dataManipulation.push({
          'type_att': element,
          'venue': data[element],
          'order': index,
          'time': index == 0 ? '9:00 Am To 11 Am' : index == 1 ? '11 Am to 1 Pm' : index == 2 ? '3 Pm to 5 Pm' : '5 Pm to 7 Pm'
        })
      })

      setAttractionTypeValue(dataManipulation)
      setAttractionTypeName(Object.keys(data))
    }

    const manipulateRestRecommendationData = (data: any, order: any) => {
      order.sort((a: any, b: any) => a.order - b.order);
      const typesArray = order.map((item: any) => item.type);
      const dataManipulation: any[] = []
      typesArray.map((element: any, index: number) => {
        dataManipulation.push({
          'type_att': element,
          'venue': data[element],
          'order': index,
          'time': index == 0 ? '1:00 Pm To 3 Am' : '7 Pm to 9 Pm'
        })
      })

      setRestaurantTypeValue(dataManipulation)
      setRestaurantTypeName(Object.keys(data))
    }

    const handleConfirmation = () => {
      setCurrentStep(currentStep + 1);
    }

    const getBack = () => {
      setCurrentStep(currentStep - 1)
      // renderStep()
    }

    const updateTags = (arr: string[]) => {
      setSelectedTags(arr)
    }

    const updateCusine = (arr: string[]) => {
      setSelectedSubCategoryTags(arr)
    }

    const updateZones = (arr: string[]) => {
      setSelectedZones(arr);
    }


    const renderStep = () => {
      switch (currentStep) {
        case 0:
          return <Questionnaire updateItinerary={updateItinerary}
            tags={tags}
            zoneGroup={zoneGroup}
            subCategory={subCategory}
            updateTags={updateTags}
            updateCusine={updateCusine}
            updateZones={updateZones}
            selectedTags={selectedTags}
            selectedSubCategoryTags={selectedSubCategoryTags}
            selectedZones={selectedZones}
          />;
        case 1:
          return <PickRecommendation
            getFare={handleGetFare}
            attractionValue={attractionTypeValue}
            attractionName={attractionTypeName}
            restaurantValue={restaurantTypeValue}
            restaurantName={restaurantTypeName}
            getBack={getBack}
          />;
        case 2:
          return <VenueSelection fareArr={fareArr} duration={durationArr} venues={finalVenues} venids={finalvenueids} finalize={handleConfirmation} />;
        case 3:
          return <ConfirmItineraryItems
            // completed={addItem} 
            venids={finalvenueids}
            date={tripDate}
          />;
        default:
          return null;
      }
    };

    return (
      <>
        {loader  ? <Loader /> :
          error !== '0' ? <ErrorPage /> :
            <Grid container style={{ backgroundColor: '#ffff' }}>
              <Grid item xs={12} style={{ width: '100%', height: '10vh', display: 'flex', alignItems: 'center' }}>
                <Header activeStep={currentStep} steps={steps} />
              </Grid>
              <Grid item xs={12} style={{ padding: '0px' }}>
                {renderStep()}
              </Grid>
            </Grid>}
      </>

    );
  };
