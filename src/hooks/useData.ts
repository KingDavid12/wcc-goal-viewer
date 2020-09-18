import { useState, useEffect } from "react";
import { JsonData } from "../models";

const useData = (onLoad: (data: JsonData) => void): [ boolean, JsonData, (value: JsonData) => void ] =>
{
    const [data, setData] = useState<JsonData>({
        primaryGoals: [],
	    tracks: [],
	    courses: []
    });
    const [isLoading, setLoading] = useState(true);

    useEffect (() =>
    {
        if (!isLoading)
        {
            return (() => {});
        }

        let isMounted = true;

        fetch("./data.json")
            .then(response => response.json())
            .then(data =>
            {
                if (!isMounted)
                {
                    return;
                }

                setData(data);
                onLoad(data);
                setLoading(false);
            });

        return (() => isMounted = false);
    }, [ onLoad, isLoading ]);

    return ([ isLoading, data, setData ]);
};

export default useData;