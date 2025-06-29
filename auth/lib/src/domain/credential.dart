enum AuthType { email, google }

extension EnumParsing on AuthType {
  String value() => this.toString();

  static AuthType fromString(String value) {
    return AuthType.values.firstWhere((element) => element.toString() == value);
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
}
