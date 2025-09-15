import 'package:auth/src/domain/credential.dart';
import 'package:auth/src/domain/token.dart';
import 'package:auth/src/infra/api/auth_api.dart';
import 'package:auth/src/infra/api/auth_api_contract.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import '../../run_server.dart';

const Map<String, String> validUser = {
  "email": "test@gmail.orgy",
  "name": "OrgyUser",
  "password": "passOrgy",
  "auth_type": "google",
};

void main() {
  late final http.Client client;
  late final IAuthApi sut;
  // late final Server server;
  String baseUrl = "http://localhost:3000";

  setUpAll(() async {
    client = http.Client();
    // server = Server();
    sut = AuthApi(baseUrl, client);
    // await server.start();
  });

  group("Authentication", () {
    test("It should return json web token when successful", () async {
      var validCreds = Credential(
        email: validUser["email"]!,
        name: validUser["name"]!,
        authType: AuthEnumParsing.fromString(validUser["auth_type"]!),
        // password: validUser["password"]!,
      );

      var result = await sut.signIn(validCreds);
      expect(result.asValue!.value, isNotEmpty);
    });
  });

  test("Should return 404 if user not found", () async {
    var credentials = Credential(
      email: "noUser@temp.com",
      authType: AuthType.email,
      password: "Labadba",
    );

    var result = await sut.signIn(credentials);
    expect(result.asError!.error, "Invalid Email or Password");
  });

  test("Should return error if password is left empty when google", () async {
    var credentials = Credential(
      email: "te3e22est@gmail.com",
      authType: AuthType.google,
      password: "hfhfgh",
      name: "",
    );

    var result = await sut.signIn(credentials);
    expect(result.asError!.error, "Name is required");
  });

  group("Sign Out", () {
    test("Should sign out with a valid user token", () async {
      var validCreds = Credential(
        email: validUser["email"]!,
        name: validUser["name"]!,
        authType: AuthEnumParsing.fromString(validUser["auth_type"]!),
        // password: validUser["password"]!,
      );

      var resu = await sut.signIn(validCreds);
      Token token = Token(resu.asValue!.value);

      var result = await sut.signOut(token);

      expect(result.asValue!.value, true);
    });
  });

  test("Should not sign out with an invalid user token", () async {
    Token token = Token("yishrioesjhfkisdjfdlsifjldzfjldsfjldsfj");

    var result = await sut.signOut(token);

    expect(result.asError!.error, false);
  });

  // tearDown(() => server.stop());
}
