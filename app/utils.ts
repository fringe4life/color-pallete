/**
   * The baseUrl for the API to fetch color schemes.
  */
export const baseUrl = "https://www.thecolorapi.com/scheme";

/**
   * The type for the returned colors from the API.
   */
  export type ReturnedColors = {
			mode: string;
			colors: {
        hex: {
          value: string;
        }
				hsl: {
					value: string;
				};
        name: {
          value: string;
        }
			}[];
		};

export const fetchColors = async (mode:string, color:string) => {
    const query = `?hex=${color}&mode=${mode}&count=5`;

					const response = await fetch(`${baseUrl}${query}`);
					if (response.ok) {
						const data = await response.json() as ReturnedColors;
						return data;
					}
                    throw Error('error')
                
}