import 'dart:convert';

import 'package:async/async.dart';
import 'package:auth/src/domain/credential.dart';
import 'package:auth/src/domain/token.dart';
import 'package:auth/src/infra/api/auth_api_contract.dart';
import 'package:http/http.dart' as http;

class AuthApi implements IAuthApi {
  final http.Client _client;
  final String _baseUrl;

  AuthApi(this._baseUrl, this._client);

  @override
  Future<Result<String>> signIn(Credential credential) async {
    var endPoint = "$_baseUrl/auth/signin";
    return await _postCredential(endPoint, credential);
  }

  @override
  Future<Result<String>> signUp(Credential credential) async {
    var endPoint = "$_baseUrl/auth/signup";
    return await _postCredential(endPoint, credential);
  }

  Future<Result<String>> _postCredential(
    String endPoint,
    Credential credential,
  ) async {
    try {
      http.Response respose = await _client.post(
        Uri.parse(endPoint),
        body: jsonEncode(credential.toJSON()),

        headers: {
          "Content-Type": "application/json",
          "User-Agent": "",
        },
      );

      var json = jsonDecode(respose.body);
      if (respose.statusCode == 200) {
        return Result.value(json["auth_token"]);
      } else {
        return Result.error(jsonDecode(respose.body)["error"]);
      }
      // return json["auth_token"] != null
      //     ? Result.value(json["auth_token"])
      //     : Result.error(json["message"]);
    } catch (e) {
      return Result.error("Server Connection Failed");
    }
  }

  @override
  Future<Result<bool>> signOut(Token token) async {
    var url = "$_baseUrl/auth/signout";
    var headers = {
      "Content-Type": "application/json",
      "Authorization": token.value,
    };
    var response = await _client.post(Uri.parse(url), headers: headers);

    if (response.statusCode == 200) {
      return Result.value(true);
    }
    return Result.error(false);
  }
}
