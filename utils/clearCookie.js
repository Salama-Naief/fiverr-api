const clearCookie = (res) => {
  res.clearCookie("token", {
    sameSite: "none",
    secure: true,
  });
};

export default clearCookie;
