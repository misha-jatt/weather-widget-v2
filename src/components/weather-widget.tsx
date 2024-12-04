"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from  "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CaseLower, CaseUpperIcon, CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface weatherdata {
    temperature:number;
    description:string;
    location:string;
    unit:string;
    }

    export default function weatherwidget() {
        const[location, setlocation] = useState<string>("");
        const[weather, setweather] = useState<weatherdata |null>(null);
        const[error,seterror]= useState<string |null>(null);
        const[isloading, setisloading]= useState<boolean>(false);

        const handlesearch = async(e:FormEvent<HTMLFormElement>) =>{
            e.preventDefault();

            const trimmedlocation = location.trim();
            if(trimmedlocation =="") {
                seterror("please enter a valid location.");
                setweather(null);
                return;
               
            }
            setisloading(true);
            seterror(null);

            try{

             const response =await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedlocation}`
            
            );

            if(!response.ok){
                throw new Error("city not found.");
            }
            const data =await response.json();
            const weatherdata :weatherdata ={
                temperature:data.current.temp_c,
                description:data.current.condition.text,
                location:data.location.name,
                unit:"c",
};
setweather(weatherdata);
            }catch(error){
                seterror("city not found.please try again");
                setweather(null);
            }finally{
                setisloading(false);
            }
};
        function gettemperaturemassage(temperature: number, unit: string): string {
            if (unit === "c") {
                if (temperature < 0) {
                    return `It's freezing at ${temperature}°C! Bundle up!`;
                } else if (temperature < 10) {
                    return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
                } else if (temperature < 20) {
                    return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
                } else if (temperature < 30) {
                    return `It's a pleasant ${temperature}°C. Stay hydrated.`;
                } else {
                    return `It's hot at ${temperature}°C. Stay hydrated!`;
                }
            } else {
                // Placeholder for other temperature units (e.g., Fahrenheit)
                return `${temperature}°${unit}`;
            }
        }

        function getWeatherMassage (description: string):string{
           switch(description.toLocaleLowerCase()){
              case "sunny":
            return "it's a beautiful sunny day!";
              case "party cloudy":
            return "expect some clouds and sunshine.";
             case "cloudy":
            return "it's cloudy today.";
              case "overcast":
            return "The sky is overcast.";
            case "rain":
            return "don't forget your umberella! It's raining.";
            case "thunderstorm":
                return "thunderstroms are unexpected stay indoors.";
                case "snow":
                    return "it's snowing outside.wear warm clothes.";
                    case "mist":
                        return "it's misty outside.";
                        case "fog":
                            return " be careful, it's foggy outside.";
                            default:
                            return description; // default to returning the description as.is
                            }
        }

        function getlocationmassage (location:string):string{
            const currenthour =new Date().getHours();
            const isnight = currenthour >=18 || currenthour <6;
            return `${location}, ${isnight ? "at night" : "During the day"}`;
 }

 return (
    <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md mx-auto text-center">
            <CardHeader>
           <CardTitle>weather weatherwidget</CardTitle>
           <CardDescription>search for the current weather conditions in your city.</CardDescription>
 </CardHeader>
 <CardContent>
 <form onSubmit={handlesearch} className="flex items-center gap-2">
    <Input 
    type="text"
    placeholder="enter city name"
    value={location}
    onChange={(e)=> setlocation(e.target.value)}
    />
    <Button type="submit" disabled={isloading}>
        {isloading ? "loading..." : "search"}
    </Button>
 </form>
 {error && <div className="mt-4 text-red-500"></div>}
 {weather && (
    <div className="mt-4 grid gap-2">
        <div className="flex items-center gap-2">
            <ThermometerIcon className="w-6 h-6" />
            {gettemperaturemassage(weather.temperature, weather.unit)}
        </div>
        <div className="flex items-center gap-2">
            <CloudIcon className="w-6 h-6" />
            {getWeatherMassage(weather.description)}
        </div>
        <div className="flex items-center gap-2">
            <MapPinIcon className="w-6 h-6" />
            {getlocationmassage(weather.location)}
        </div>
    </div>
 )}
 </CardContent>
  </Card>
    </div>
)
}
    
