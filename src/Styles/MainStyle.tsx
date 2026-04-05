import { StyleSheet } from 'react-native';
import colors from '../Constant/Color';

let MainStyle = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  containerWithPadding: {
    flex: 1,
    paddingHorizontal: 15
  },
  flexBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15
  },
  flexCloumn: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  flexLeft: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  flexRight: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  }
});
export default MainStyle;
