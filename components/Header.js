import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import SearchComponent from "./SearchComponent";
import { useSelector } from "react-redux";

const Header = ({
  title,
  titleColor,
  showSearchComponent,
  goBack,
  backBtnClr,
  showProfile,
  showRightIcon,
  profileIconClr,
  rtIcon,
  onBackPress,
  onImagePress,
  backgroundColor,
  onRtIconPress,
}) => {
  const auth = useSelector((state) => state.userAuth || {});
  const isAuthenticated = auth.isAuthenticated || false;
  const userData = auth.user || null;

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: backgroundColor ? backgroundColor : "transparent" },
      ]}
    >
      <View>
        {goBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <FontAwesome
              name="arrow-left"
              size={24}
              color={backBtnClr ? backBtnClr : "white"}
            />
          </TouchableOpacity>
        ) : showProfile ? (
          <TouchableOpacity style={styles.profileButton} onPress={onImagePress}>
            {isAuthenticated && userData?.avatar ? (
              <Image
                source={{ uri: userData?.avatar }}
                style={styles.profileImage}
              />
            ) : (
              <FontAwesome
                name="user-circle"
                size={32}
                color={profileIconClr ? profileIconClr : "white"}
              />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.centerContent}>
        {showSearchComponent ? (
          <SearchComponent />
        ) : (
          <Text
            style={[
              { color: titleColor ? titleColor : "white" },
              styles.headerTitle,
            ]}
          >
            {title}
          </Text>
        )}
      </View>

      {showRightIcon ? (
        <TouchableOpacity style={styles.profileButton} onPress={onRtIconPress}>
          {rtIcon}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingTop: Platform.OS == "ios" ? 0 : 30,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    justifyContent: "space-between",
  },
  leftContainer: {
    width: 40,
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  profileButton: {
    padding: 5,
    marginRight: 10,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
});
