enum AuthType { email, google }

extension AuthEnumParsing on AuthType {
  String value() => this.name;

  static AuthType fromString(String value) {
    return AuthType.values.firstWhere((element) => element.name == value);
  }
}

class Credential {
  final String name;
  final String email;
  final String? password;
  final AuthType authType;

  Credential({
    required this.email,
    this.name = "",
    this.password,
    required this.authType,
  }) {
    if (authType == AuthType.email && (password == null || password!.isEmpty)) {
      throw Exception("Password cannot be null or Empty in email");
    }
  }

  toJSON() => {
    'name': name,
    'email': email,
    'password': password,
    "auth_type": authType.value(),
  };

  // factory Credential.fromJSON(Map<String, dynamic> credMap) {
  //   return Credential(email: email, authType: authType);
  // }
}
