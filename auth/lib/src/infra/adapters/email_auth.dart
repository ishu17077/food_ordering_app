import 'package:async/async.dart';
import 'package:auth/src/domain/auth_service_contract.dart';
import 'package:auth/src/domain/credential.dart';
import 'package:auth/src/domain/signup_service_contract.dart';
import 'package:auth/src/domain/token.dart';
import 'package:auth/src/infra/api/auth_api_contract.dart';

class EmailAuth implements IAuthService, ISignUpService {
  final IAuthApi _api;
  late final Credential _credential;

  EmailAuth(this._api);

  void credential({required String email, required String password}) {
    _credential = Credential(
      email: email,
      password: password,
      authType: AuthType.email,
    );
  }

  @override
  Future<Result<Token>> signIn() async {
    assert(_credential != null);
    var result = await _api.signIn(_credential!);
    if (result.isError) {
      return result.asError!;
    }
    return Result.value(Token(result.asValue!.value));
  }

  @override
  Future<void> signOut() {
    // TODO: implement signOut
    throw UnimplementedError();
  }

  @override
  Future<Result<Token>> signUp(
    String name,
    String email,
    String password,
  ) async {
    Credential credential = Credential(
      email: email,
      password: password,
      authType: AuthType.email,
      name: name,
    );

    var result = await _api.signUp(credential);
    if (result.isError) {
      return result.asError!;
    }
    return Result.value(Token(result.asValue!.value));
  }
}
