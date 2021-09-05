
import st from "silly-datetime";
 const now = st.format(new Date(), 'YYYY-MM-DD 03:00:00') 
 const tomorrow = st.format(new Date(new Date().setDate(new Date().getDate() + 1)), 'YYYY-MM-DD 03:00:00')
 console.log(now,tomorrow)