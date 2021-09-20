import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import Colors from "../../../colors"
import IsPhoneContext from '../../../contexts/isPhoneContext'
import { useContext } from 'react'

export default function ProductPriceGraph({ prices }) {
    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    // Filter out zero prices
    // eslint-disable-next-line
    let filteredPrices = prices.filter((pricePoint) => (pricePoint.price != 0))

    return (
        <LineChart data={filteredPrices} width={isPhone ? 268 : 300} height={180} style={{
            backgroundColor: Colors.offwhite,
            fontSize: "12px",
            borderRadius: "2px",
            marginTop: "8px",
            marginBottom: "4px",
            fontFamily: 'raleway'
        }}
            margin={{ right: 50, bottom: 0 }}>
            <Line type="monotone" dataKey="price" stroke={Colors.primary}
                isAnimationActive={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
        </LineChart>
    )
}