import 'package:async/async.dart';
import 'package:auth/src/domain/credential.dart';
import 'package:auth/src/infra/api/auth_api.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:http/http.dart' as http;
import 'auth_api_test.mocks.dart';

@GenerateNiceMocks([MockSpec<http.Client>()])
// class MockClient extends Mock implements http.Client {}
var httpcom = 'http://8080.com';
void main() {
  late MockClient client;
  late AuthApi sut;

  setUp(() {
    client = MockClient();

    sut = AuthApi(httpcom, client);
  });

  group('signIn with Email', () {
    Credential credential = Credential(
      email: 'ishu17077@github',
      authType: AuthType.email,
      password: 'pass',
    );
    test("Should return error when status code is not 200", () async {
      when(
        client.post(any, body: anyNamed("body")),
      ).thenAnswer((_) async => http.Response('{}', 400));

      var result = await sut.signIn(credential);
      expect(result, isA<ErrorResult>());
    });
    test(
      "Should return error when status code is 200 but the credentials token could not be supplied",
      () async {
        when(
          client.post(any, body: anyNamed("body")),
        ).thenAnswer((_) async => http.Response('{}', 200));

        var result = await sut.signIn(credential);
        expect(result, isA<ErrorResult>());
      },
    );
    test("Should return token string on successful auth", () async {
      var tokenString = 'dadasdsadasadasdsadas';
      when(client.post(any, body: anyNamed("body"))).thenAnswer((_) async {
        return http.Response("{\"auth_token\": \"$tokenString\"}", 200);
      });

      var result = await sut.signIn(credential);
      expect(result.asValue!.value, tokenString);
    });
  });
}
