import 'dart:convert';

import 'package:async/async.dart';
import 'package:auth/src/domain/credential.dart';
import 'package:auth/src/infra/api/auth_api_contract.dart';
import 'package:http/http.dart' as http;

class AuthApi implements IAuthApi {
  final http.Client _client;
  final String _baseUrl;

  AuthApi(this._baseUrl, this._client);

  @override
  Future<Result<String>> signIn(Credential credential) async {
    var endPoint = _baseUrl + "/auth/signin";
    return await _postCredential(endPoint, credential);
  }

  @override
  Future<Result<String>> signUp(Credential credential) async {
    var endPoint = _baseUrl + "/auth/signup";
    return await _postCredential(endPoint, credential);
  }

  Future<Result<String>> _postCredential(
    String endPoint,
    Credential credential,
  ) async {
    try {
      http.Response respose = await _client.post(
        Uri.parse(endPoint),
        body: credential.toJSON(),
      );
      if (respose.statusCode != 200) {
        return Result.error("Server Error");
      }
      var json = jsonDecode(respose.body);

      return json["auth_token"] != null
          ? Result.value(json["auth_token"])
          : Result.error(json["message"]);
    } catch (e) {
      return Result.error("Server Connection Failed");
    }
  }
}
